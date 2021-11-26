import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserNotFoundException } from '../exception/user_not_found_exception';
import { UserPwdIncorrectException } from '../exception/user_pwd_incorrect_exception';
import { SIGNUP_SUCCESS_MSG } from '../message/message';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  // == 회원가입 == //
  async signup(userDto: UserDto): Promise<string> {
    const { username, password } = userDto;

    await this.userRepository.createUser(
      username,
      await this.createBcryptPwd(password),
    );

    return SIGNUP_SUCCESS_MSG;
  }

  // == 로그인 == //
  async login(userDto: UserDto): Promise<{ accessToken: string }> {
    const { username, password } = userDto;

    const foundUser = await this.userRepository.findOne({ username });

    if (!foundUser) {
      throw new UserNotFoundException();
    }

    if (!(await bcrypt.compare(password, foundUser.password))) {
      throw new UserPwdIncorrectException();
    }

    const payload = { username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  // == private == //
  // == pwd -> salt + hash == //
  private async createBcryptPwd(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
