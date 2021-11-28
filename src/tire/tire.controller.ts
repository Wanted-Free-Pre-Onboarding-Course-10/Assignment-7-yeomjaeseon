import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { SaveTireDto } from './dto/save.tire.dto';
import { TireService } from './tire.service';
import { AuthGuard } from '@nestjs/passport';
import { SaveTireValidationPipe } from './pipes/save-tire-validation.pipe';

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
  ) {
    this.logger.debug(JSON.stringify(saveTireDtos));
    await this.tireService.createTire(saveTireDtos);
  }
}
