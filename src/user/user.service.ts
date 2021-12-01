import { Injectable, Logger } from '@nestjs/common';
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
      throw new UserNotFoundException(username);
    }

    if (!(await this.isRightPwd(password, foundUser.password)))
      throw new UserPwdIncorrectException();

    const accessToken = this.generateJwtToken(username);
    this.logger.debug(`Generated JWT token ${JSON.stringify(accessToken)}`);

    return { accessToken };
  }

  // == private methods == //
  // == pwd -> salt + hash == //
  private async createBcryptPwd(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  // == generate jwt token == //
  private generateJwtToken(username: string): string {
    const payload = { username };

    this.logger.debug(`Generated JWT token ${JSON.stringify(payload)}`);
    return this.jwtService.sign(payload);
  }

  // == pwd compare == //
  private async isRightPwd(
    inputPwd: string,
    hashedUserPwd: string,
  ): Promise<boolean> {
    return await bcrypt.compare(inputPwd, hashedUserPwd);
  }
}
