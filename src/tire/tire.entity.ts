import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TireType } from './tire-type.enum';
import { Trim } from '../trim/trim.entity';

@Entity()
export class Tire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  width: number;

  @Column({ name: 'aspect_ratio', nullable: false })
  aspectRatio: number;

  @Column({ name: 'wheel_size', nullable: false })
  wheelSize: number;

  @Column({ enum: TireType })
  type: number;

  @ManyToOne((type) => Trim, (trim) => trim.tires)
  trim: Trim;
}
