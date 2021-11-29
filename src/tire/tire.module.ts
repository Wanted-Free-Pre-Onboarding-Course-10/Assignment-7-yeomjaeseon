import { Module } from '@nestjs/common';
import { TireController } from './tire.controller';
import { TireService } from './tire.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TireRepository } from './tire.repository';
import { TrimModule } from '../trim/trim.module';
import { UserTrimModule } from '../user-trim/user-trim.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([TireRepository]),
    UserModule,
    TrimModule,
    UserTrimModule,
    HttpModule,
  ],
  controllers: [TireController],
  providers: [TireService],
})
export class TireModule {}
