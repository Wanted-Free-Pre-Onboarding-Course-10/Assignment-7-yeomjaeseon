import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { SaveTireDto } from '../tire/dto/save.tire.dto';

@Controller('user')
@UsePipes(ValidationPipe)
export class UserController {
  private logger = new Logger('UserController');

  constructor(private userService: UserService) {}

  //== 회원가입 == //
  @Post('/signup')
  signup(@Body() userDto: UserDto): Promise<string> {
    this.logger.debug(JSON.stringify(userDto));
    return this.userService.signup(userDto);
  }

  //== 로그인 == //
  @Post('/login')
  login(@Body() userDto: UserDto): Promise<{ accessToken: string }> {
    this.logger.debug(JSON.stringify(userDto));
    return this.userService.login(userDto);
  }
}
