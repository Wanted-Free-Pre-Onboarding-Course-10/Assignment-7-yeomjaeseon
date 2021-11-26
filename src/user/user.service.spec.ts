import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { SIGNUP_SUCCESS_MSG } from '../message/message';
import { UserDuplicateException } from '../exception/user_duplicate_exception';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserNotFoundException } from '../exception/user_not_found_exception';
import { UserPwdIncorrectException } from '../exception/user_pwd_incorrect_exception';

const mockRepository = {
  createUser: jest.fn(),
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  // == signup test == //
  describe('signup test', () => {
    it('회원가입 성공 ', async () => {
      //given
      const userDto: UserDto = {
        username: 'test',
        password: '1234abcd',
      };

      mockRepository.createUser.mockResolvedValueOnce({
        id: 1,
        username: userDto.username,
        password: userDto.password,
      });

      //when
      const result = await service.signup(userDto);

      //then
      expect(result).toEqual(SIGNUP_SUCCESS_MSG);
    });

    it('회원가입 실패 - 유저 아이디 중복', async () => {
      //given
      const userDto: UserDto = {
        username: 'test',
        password: '1234abcd',
      };
      //
      //when
      mockRepository.createUser.mockRejectedValueOnce(
        new UserDuplicateException(),
      );
      //
      //then
      await expect(service.signup(userDto)).rejects.toThrow(
        new UserDuplicateException(),
      );
    });

    it('회원가입 실패 - db 에러', async () => {
      //given
      const userDto: UserDto = {
        username: 'test',
        password: '1234abcd',
      };
      //
      //when
      mockRepository.createUser.mockRejectedValueOnce(
        new InternalServerErrorException(),
      );
      //
      //then
      await expect(service.signup(userDto)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });
  });

  // == login test == //
  describe('login test', () => {
    it('로그인 성공', async () => {
      //given
      const userDto: UserDto = {
        username: 'test',
        password: '1234abcd',
      };

      const salt = await bcrypt.genSalt();
      const hashPwd = await bcrypt.hash(userDto.password, salt);

      mockRepository.findOne.mockResolvedValueOnce({
        id: 1,
        username: userDto.username,
        password: hashPwd,
      });

      mockJwtService.sign.mockReturnValueOnce('access_token');

      //when
      const result = await service.login(userDto);

      //then
      expect(result.accessToken).toEqual('access_token');
    });

    it('로그인 실패 -  해당 유저 없음', async () => {
      //given
      const userDto: UserDto = {
        username: 'test',
        password: '1234abcd',
      };

      //when
      mockRepository.findOne.mockResolvedValueOnce(null);

      //then
      await expect(service.login(userDto)).rejects.toThrow(
        new UserNotFoundException(),
      );
    });
    it('로그인 실패 - 비밀번호 틀림', async () => {
      //given
      const userDto: UserDto = {
        username: 'test',
        password: '1234abcd',
      };

      //when
      mockRepository.findOne.mockResolvedValueOnce({
        id: 1,
        username: userDto.username,
        password: 'incorrectPassword',
      });

      //then
      await expect(service.login(userDto)).rejects.toThrow(
        new UserPwdIncorrectException(),
      );
    });
  });
});
