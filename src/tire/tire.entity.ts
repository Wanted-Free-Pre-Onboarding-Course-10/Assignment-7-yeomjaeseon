import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TireType } from './tiretype.enum';
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

  @Column()
  type: TireType;

  @ManyToOne((type) => Trim, (trim) => trim.tires)
  trim: Trim;
}
