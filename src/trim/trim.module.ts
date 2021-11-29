import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrimRepository } from './trim.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TrimRepository])],
  exports: [TypeOrmModule],
})
export class TrimModule {}
