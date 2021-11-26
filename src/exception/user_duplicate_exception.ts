import { ConflictException } from '@nestjs/common';
import { USER_DUPLICATE_EXCEPTION_MSG } from '../message/message';

export class UserDuplicateException extends ConflictException {
  constructor() {
    super(USER_DUPLICATE_EXCEPTION_MSG);
  }
}
