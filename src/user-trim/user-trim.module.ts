import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTrimRepository } from './user-trim.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserTrimRepository])],
  exports: [TypeOrmModule],
})
export class UserTrimModule {}
