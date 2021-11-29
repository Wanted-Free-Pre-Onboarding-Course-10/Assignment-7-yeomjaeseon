import { Test, TestingModule } from '@nestjs/testing';
import { TireService } from './tire.service';
import { TireRepository } from './tire.repository';
import { TrimRepository } from '../trim/trim.repository';
import { UserRepository } from '../user/user.repository';
import { UserTrimRepository } from '../user-trim/user-trim.repository';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SaveTireDto } from './dto/save.tire.dto';
import { Connection, QueryRunner } from 'typeorm';
import { TIRE_SAVE_SUCCESS_MSG } from '../message/message';
import { UserNotFoundException } from '../exception/user_not_found_exception';
import { NotNormalTireDataException } from '../exception/not_normal_tire_data_exception';
import { RequestFailException } from '../exception/request_fail_exception';

const mockTireRepository = {
  createTire: jest.fn(),
};
const mockTrimRepository = {
  findOne: jest.fn(),
  createTrim: jest.fn(),
};
const mockUserRepository = {
  findOne: jest.fn(),
};
const mockUserTrimRepository = {
  saveUserTrim: jest.fn(),
};

describe('TireService', () => {
  let service: TireService;
  let connection: Connection;
  let httpService: HttpService;

  const queryRunner = {
    manager: {},
  } as QueryRunner;

  class ConnectionMock {
    createQueryRunner(mode?: 'master' | 'slave'): QueryRunner {
      return queryRunner;
    }
  }

  beforeEach(async () => {
    queryRunner.connect = jest.fn();
    queryRunner.release = jest.fn();
    queryRunner.startTransaction = jest.fn();
    queryRunner.commitTransaction = jest.fn();
    queryRunner.rollbackTransaction = jest.fn();
    queryRunner.release = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        TireService,
        {
          provide: TireRepository,
          useValue: mockTireRepository,
        },
        {
          provide: TrimRepository,
          useValue: mockTrimRepository,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: UserTrimRepository,
          useValue: mockUserTrimRepository,
        },
        {
          provide: Connection,
          useClass: ConnectionMock,
        },
      ],
    }).compile();

    service = module.get<TireService>(TireService);
    connection = module.get<Connection>(Connection);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('createTire test', () => {
    it('타이어 생성 성공 - 이미 해당 trim 이 db에 있음', async () => {
      //given
      const saveTireDtos: SaveTireDto[] = [
        {
          id: 'candycandy',
          trimId: 5000,
        },
        {
          id: 'ronaldo',
          trimId: 6000,
        },
      ];
      mockUserRepository.findOne
        .mockResolvedValueOnce({
          id: 1,
          username: 'candycandy',
          password: 'password',
        })
        .mockResolvedValueOnce({
          id: 2,
          username: 'ronaldo',
          password: 'password',
        });

      mockTrimRepository.findOne
        .mockResolvedValueOnce({
          id: 1,
          trim_id: 5000,
        })
        .mockResolvedValueOnce({
          id: 2,
          trim_id: 6000,
        });

      //when
      const resultMsg = await service.createTire(saveTireDtos);

      //then
      expect(resultMsg).toEqual(TIRE_SAVE_SUCCESS_MSG);
    });
    it('타이어 생성 성공 - 해당 trim 이 db에 없음', async () => {
      //given
      const saveTireDtos: SaveTireDto[] = [
        {
          id: 'candycandy',
          trimId: 5000,
        },
        {
          id: 'ronaldo',
          trimId: 7000,
        },
      ];
      mockUserRepository.findOne
        .mockResolvedValueOnce({
          id: 1,
          username: 'candycandy',
          password: 'password',
        })
        .mockResolvedValueOnce({
          id: 2,
          username: 'ronaldo',
          password: 'password',
        });

      mockTrimRepository.findOne
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);

      //when
      const resultMsg = await service.createTire(saveTireDtos);

      //then
      expect(resultMsg).toEqual(TIRE_SAVE_SUCCESS_MSG);
    });
    it('타이어 생성 실패 - 해당 아이디의 유저가 없음', async () => {
      //given
      const saveTireDtos: SaveTireDto[] = [
        {
          id: 'candycandy',
          trimId: 5000,
        },
        {
          id: 'ronaldo',
          trimId: 7000,
        },
      ];

      //when
      mockUserRepository.findOne.mockResolvedValueOnce(undefined);

      //then
      await expect(service.createTire(saveTireDtos)).rejects.toThrow(
        new UserNotFoundException('candycandy'),
      );
    });
    it('타이어 생성 실패 - 타이어 데이터 포멧 문제있음', async () => {
      //given
      const saveTireDtos: SaveTireDto[] = [
        {
          id: 'candycandy',
          trimId: 6000,
        },
        {
          id: 'ronaldo',
          trimId: 7000,
        },
      ];

      mockUserRepository.findOne.mockResolvedValueOnce({
        id: 1,
        username: 'candycandy',
        password: 'password',
      });

      mockTrimRepository.findOne.mockResolvedValueOnce(undefined);

      //when
      //then
      await expect(service.createTire(saveTireDtos)).rejects.toThrow(
        new NotNormalTireDataException(6000),
      );
    });
    it('타이어 생성 실패 - 해당 trimId 로 요청시 실패', async () => {
      //given
      const saveTireDtos: SaveTireDto[] = [
        {
          id: 'candycandy',
          trimId: 6000000,
        },
        {
          id: 'ronaldo',
          trimId: 7000,
        },
      ];

      mockUserRepository.findOne.mockResolvedValueOnce({
        id: 1,
        username: 'candycandy',
        password: 'password',
      });

      mockTrimRepository.findOne.mockResolvedValueOnce(undefined);
      //when
      //then
      await expect(service.createTire(saveTireDtos)).rejects.toThrow(
        new RequestFailException(6000000),
      );
    });
  });
});
