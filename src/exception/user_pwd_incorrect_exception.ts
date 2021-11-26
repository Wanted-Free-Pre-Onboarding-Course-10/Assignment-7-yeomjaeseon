import { UnauthorizedException } from '@nestjs/common';
import { USER_PWD_INCORRECT_EXCEPTION_MSG } from '../message/message';

export class UserPwdIncorrectException extends UnauthorizedException {
  constructor() {
    super(USER_PWD_INCORRECT_EXCEPTION_MSG);
  }
}
