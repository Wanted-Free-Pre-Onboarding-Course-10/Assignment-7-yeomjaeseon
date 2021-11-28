import { EntityRepository, Repository } from 'typeorm';
import { Trim } from './trim.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(Trim)
export class TrimRepository extends Repository<Trim> {
  private logger = new Logger('TrimRepository');

  async createTrim(trimId: number): Promise<Trim> {
    const trim = this.create({ trimId });

    await this.save(trim);

    return trim;
  }
}
