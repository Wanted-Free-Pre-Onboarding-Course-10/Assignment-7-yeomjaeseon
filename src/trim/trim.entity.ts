import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Tire } from '../tire/tire.entity';

@Entity()
export class Trim {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.trims)
  user: User;

  @OneToMany((type) => Tire, (tire) => tire.trim, { eager: true })
  tires: Tire[];
}
