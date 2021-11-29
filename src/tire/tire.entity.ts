import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TireType } from './tire-type.enum';
import { Trim } from '../trim/trim.entity';

@Entity()
export class Tire {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  width: number;

  @Column({ name: 'aspect_ratio', nullable: false })
  aspectRatio: number;

  @Column({ name: 'wheel_size', nullable: false })
  wheelSize: number;

  @Column({ enum: TireType, nullable: false })
  type: number;

  @ManyToOne((type) => Trim, (trim) => trim.tires)
  @JoinColumn({ name: 'trim_id' })
  trim: Trim;
}
