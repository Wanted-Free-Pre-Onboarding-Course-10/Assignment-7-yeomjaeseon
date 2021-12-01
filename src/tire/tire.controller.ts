import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SaveTireDto } from './dto/save.tire.dto';
import { TireService } from './tire.service';
import { AuthGuard } from '@nestjs/passport';
import { SaveTireValidationPipe } from './pipes/save-tire-validation.pipe';
import { ResponseTireDto } from './dto/response.tire.dto';

@Controller('tire')
@UseGuards(AuthGuard())
export class TireController {
  private logger = new Logger('TireController');

  constructor(private tireService: TireService) {}

  // == 타이어 정보 저장 == //
  @Post()
  async createTire(
    @Body(SaveTireValidationPipe) saveTireDtos: SaveTireDto[],
    @Req() req,
  ): Promise<string> {
    this.logger.debug(JSON.stringify(saveTireDtos));
    return await this.tireService.createTire(saveTireDtos);
  }

  // == 타이어 조회 == //
  @Get()
  async findMyTire(@Req() req): Promise<ResponseTireDto> {
    this.logger.debug(req.user);
    return await this.tireService.findTire(req.user);
  }
}
