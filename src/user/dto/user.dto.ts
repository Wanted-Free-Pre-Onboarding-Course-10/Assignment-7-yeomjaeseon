import { IsNotEmpty, Matches } from 'class-validator';
import { DTO_NOT_EMPTY_MSG, DTO_PWD_REGEX_MSG } from '../../message/message';

export class UserDto {
  @IsNotEmpty({ message: DTO_NOT_EMPTY_MSG })
  username: string;
  @IsNotEmpty({ message: DTO_NOT_EMPTY_MSG })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: DTO_PWD_REGEX_MSG,
  })
  password: string;
}
