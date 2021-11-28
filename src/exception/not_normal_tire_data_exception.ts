import { InternalServerErrorException } from '@nestjs/common';
import { NOT_NORMAL_TIRE_DATA_EXCEPTION_MSG } from '../message/message';

export class NotNormalTireDataException extends InternalServerErrorException {
  constructor() {
    super(NOT_NORMAL_TIRE_DATA_EXCEPTION_MSG);
  }
}
