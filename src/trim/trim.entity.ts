import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tire } from '../tire/tire.entity';
import { UserTrim } from '../user-trim/user-trim.entity';

@Entity()
export class Trim {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'trim_id', nullable: false, unique: true })
  trimId: number;

  @OneToMany((type) => UserTrim, (userTrim) => userTrim.trim)
  userTrims: UserTrim[];

  @OneToMany((type) => Tire, (tire) => tire.trim, { eager: true })
  tires: Tire[];
}
