import { Module } from '@nestjs/common';
import { TireController } from './tire.controller';
import { TireService } from './tire.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [TireController],
  providers: [TireService],
})
export class TireModule {}
