import { BadRequestException, PipeTransform } from '@nestjs/common';
import {
  DTO_SAVE_TIRE_ARRAY_MSG,
  DTO_SAVE_TIRE_INTACT_MSG,
  DTO_SAVE_TIRE_TYPE_MSG,
} from '../../message/message';

export class SaveTireValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!this.isArrayAndMin1Length(value))
      throw new BadRequestException(DTO_SAVE_TIRE_ARRAY_MSG);

    if (!this.isIntact(value))
      throw new BadRequestException(DTO_SAVE_TIRE_INTACT_MSG);

    if (!this.isTypeCheck(value))
      throw new BadRequestException(DTO_SAVE_TIRE_TYPE_MSG);
    return value;
  }
  private isArrayAndMin1Length(value: any): boolean {
    if (value instanceof Array && value.length > 0) return true;
    return false;
  }

  private isIntact(value: any): boolean {
    let i = 0;
    for (i = 0; i < value.length; i++) {
      const each = value[i];
      if (each.id === undefined || each.trimId === undefined) {
        return false;
      }
    }
    return true;
  }

  private isTypeCheck(value: any): boolean {
    let i = 0;
    for (i = 0; i < value.length; i++) {
      const each = value[i];
      if (typeof each.id !== 'string' || typeof each.trimId !== 'number') {
        return false;
      }
    }
    return true;
  }
}
