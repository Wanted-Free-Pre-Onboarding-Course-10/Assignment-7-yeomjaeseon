import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TireRepository } from './tire.repository';
import { SaveTireDto } from './dto/save.tire.dto';
import { UserRepository } from '../user/user.repository';
import { TrimRepository } from '../trim/trim.repository';
import { UserTrimRepository } from '../user-trim/user-trim.repository';
import { UserNotFoundException } from '../exception/user_not_found_exception';
import { HttpService } from '@nestjs/axios';
import {
  EntireTireInfo,
  ResponseTireInfo,
  TireInfo,
} from '../type/type.definition';
import { Connection } from 'typeorm';
import { NotNormalTireDataException } from '../exception/not_normal_tire_data_exception';
import { TIRE_SAVE_SUCCESS_MSG } from '../message/message';
import { RequestFailException } from '../exception/request_fail_exception';
import { User } from '../user/user.entity';
import { ResponseTireDto } from './dto/response.tire.dto';

@Injectable()
export class TireService {
  private logger = new Logger('TireService');
  private CARDAC_API_URL = (trimId: number) =>
    `https://dev.mycar.cardoc.co.kr/v1/trim/${trimId}`;

  constructor(
    @InjectRepository(TireRepository)
    private tireRepository: TireRepository,
    @InjectRepository(TrimRepository)
    private trimRepository: TrimRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(UserTrimRepository)
    private userTrimRepository: UserTrimRepository,
    private httpService: HttpService,
    private connection: Connection,
  ) {}

  // == 타이어 저장 == //
  async createTire(saveTireDtos: SaveTireDto[]): Promise<string> {
    // == 하나라도 문제가 있으면 모두 롤백 처리 == //
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const saveTireDto of saveTireDtos) {
        const { id, trimId } = saveTireDto;
        let foundTrim = await this.trimRepository.findOne({ trimId });

        const foundUser = await this.userRepository.findOne({ username: id });

        //해당 아이디의 유저가 없으면 예외처리
        if (!foundUser) throw new UserNotFoundException(id);

        if (!foundTrim) {
          // 타이어 정보 요청
          const foundTireInfo = await this.findTireOfTrimInfo(trimId);
          this.logger.debug(JSON.stringify(foundTireInfo));

          //trim 저장
          foundTrim = await this.trimRepository.createTrim(trimId);

          //tire 데이터 저장
          await this.tireRepository.createTire(foundTireInfo, foundTrim);
        }

        // 유저, 차 연결테이블 저장
        await this.userTrimRepository.saveUserTrim(foundUser, foundTrim);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return TIRE_SAVE_SUCCESS_MSG;
  }

  async findTire(user: User): Promise<ResponseTireDto> {
    const datas: ResponseTireInfo[] = [];

    // user의 trimId 로 user_trim조회 - tire정보는 eager로 한꺼번에 조회
    for (const userTrim of user.userTrims) {
      const userTrims = await this.userTrimRepository.findUserTrimById(
        userTrim.id,
      );
      const { trimId, tires } = userTrims[0].trim;

      // response를 위한 data
      datas.push({
        trimId,
        frontTire: {
          width: tires[0].width,
          aspectRatio: tires[0].aspectRatio,
          wheelSize: tires[0].wheelSize,
        },
        rearTire: {
          width: tires[1].width,
          aspectRatio: tires[1].aspectRatio,
          wheelSize: tires[1].wheelSize,
        },
      });
    }

    return this.makeResponseDto(user.username, datas);
  }

  // == private methods == //
  // == reponse dto 만드는 메서드 == //
  private makeResponseDto(
    username: string,
    datas: ResponseTireInfo[],
  ): ResponseTireDto {
    const responseData = {
      user: username,
      data: datas,
    };

    return responseData;
  }

  // == trim 정보 요청 api == //
  private async findTireOfTrimInfo(trimId: number): Promise<EntireTireInfo> {
    let trimInfo;
    try {
      trimInfo = await this.httpService
        .get(this.CARDAC_API_URL(trimId))
        .toPromise();
    } catch (error) {
      this.logger.error(error);
      throw new RequestFailException(trimId);
    }

    const frontTire = trimInfo.data.spec.driving.frontTire.value;
    const rearTire = trimInfo.data.spec.driving.rearTire.value;

    const frontTireResult = this.parseTireData(frontTire, trimId);
    const rearTireResult = this.parseTireData(rearTire, trimId);

    return {
      frontTire: frontTireResult,
      rearTire: rearTireResult,
    };
  }

  // == tire 문자열 데이터 파싱 == //
  private parseTireData(value: string, trimId: number): TireInfo {
    const splitResult = value.split(/[\/|R]/);
    const tireInfo = {
      width: parseInt(splitResult[0]),
      aspectRatio: parseInt(splitResult[1]),
      wheelSize: parseInt(splitResult[2]),
    };

    if (!this.isRightTireDataFormat(tireInfo))
      throw new NotNormalTireDataException(trimId);

    return {
      width: tireInfo.width,
      aspectRatio: tireInfo.aspectRatio,
      wheelSize: tireInfo.wheelSize,
    };
  }

  // == tire 데이터 포멧 적절한지 확인 메서드 == //
  private isRightTireDataFormat(tireInfo: TireInfo): boolean {
    const { width, aspectRatio, wheelSize } = tireInfo;

    if (!width || !aspectRatio || !wheelSize) {
      return false;
    }
    return true;
  }
}
