import { EntityRepository, Repository } from 'typeorm';
import { Tire } from './tire.entity';
import { Logger } from '@nestjs/common';
import { EntireTireInfo } from '../type/type.definition';
import { TireType } from './tire-type.enum';
import { Trim } from '../trim/trim.entity';

@EntityRepository(Tire)
export class TireRepository extends Repository<Tire> {
  private logger = new Logger('TireRepository');

  // 타이어 저장
  async createTire(entireTireInfo: EntireTireInfo, trim: Trim) {
    const { frontTire, rearTire } = entireTireInfo;

    // == frontTire save == //
    const frontTireData = this.create({
      width: frontTire.width,
      aspectRatio: frontTire.aspectRatio,
      wheelSize: frontTire.wheelSize,
      type: TireType.FRONT,
      trim,
    });

    await this.save(frontTireData);

    // == rearTire save == //
    const rearTireData = this.create({
      width: rearTire.width,
      aspectRatio: rearTire.aspectRatio,
      wheelSize: rearTire.wheelSize,
      type: TireType.REAR,
      trim,
    });

    await this.save(rearTireData);
  }
}
