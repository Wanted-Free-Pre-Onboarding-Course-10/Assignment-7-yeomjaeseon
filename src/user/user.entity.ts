import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Trim } from '../trim/trim.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @OneToMany((type) => Trim, (trim) => trim.user, { eager: true })
  trims: Trim[];
}
