import { NotFoundException } from '@nestjs/common';
import { USER_NOT_FOUND_EXCEPTION_MSG } from '../message/message';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(USER_NOT_FOUND_EXCEPTION_MSG);
  }
}
