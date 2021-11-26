import { UnauthorizedException } from '@nestjs/common';
import { LOGIN_NECESSARY_EXCEPTION_MSG } from '../message/message';

export class LoginNecessaryException extends UnauthorizedException {
  constructor() {
    super(LOGIN_NECESSARY_EXCEPTION_MSG);
  }
}
