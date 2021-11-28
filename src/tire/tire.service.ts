import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TireRepository } from './tire.repository';
import { SaveTireDto } from './dto/save.tire.dto';
import { UserRepository } from '../user/user.repository';
import { TrimRepository } from '../trim/trim.repository';
import { UserTrimRepository } from '../user-trim/user-trim.repository';
import { UserNotFoundException } from '../exception/user_not_found_exception';
import { HttpService } from '@nestjs/axios';
import { EntireTireInfo, TireInfo } from '../type/type.definition';

@Injectable()
export class TireService {
  private logger = new Logger('TireService');

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
  ) {}

  async createTire(saveTireDtos: SaveTireDto[]): Promise<void> {
    for (const saveTireDto of saveTireDtos) {
      const { id, trimId } = saveTireDto;
      let foundTrim = await this.trimRepository.findOne({ trimId });

      const foundUser = await this.userRepository.findOne({ username: id });

      //해당 아이디의 유저가 없으면 예외처리
      if (!foundUser) throw new UserNotFoundException(id);

      if (!foundTrim) {
        // 타이어 정보 요청
        const foundTireInfo = await this.findTireOfTrimInfo(trimId);

        //trim 저장
        foundTrim = await this.trimRepository.createTrim(trimId);

        //tire 데이터 저장
        await this.tireRepository.createTire(foundTireInfo, foundTrim);
      }

      // 유저, 차 연결테이블 저장
      await this.userTrimRepository.saveUserTrim(foundUser, foundTrim);
    }
  }

  // == trim 정보 요청 api == //
  private async findTireOfTrimInfo(trimId: number): Promise<EntireTireInfo> {
    const trimInfo = await this.httpService
      .get(`https://dev.mycar.cardoc.co.kr/v1/trim/${trimId}`)
      .toPromise();

    const frontTire = trimInfo.data.spec.driving.frontTire.value;
    const rearTire = trimInfo.data.spec.driving.rearTire.value;
    const frontTireResult = this.parseTireData(frontTire);
    const rearTireResult = this.parseTireData(rearTire);

    return {
      frontTire: frontTireResult,
      rearTire: rearTireResult,
    };
  }

  // == tire 문자열 데이터 파싱 == //
  private parseTireData(value: string): TireInfo {
    const splitResult = value.split(/[\/|R]/);
    return {
      width: parseInt(splitResult[0]),
      aspectRatio: parseInt(splitResult[1]),
      wheelSize: parseInt(splitResult[2]),
    };
  }
}
