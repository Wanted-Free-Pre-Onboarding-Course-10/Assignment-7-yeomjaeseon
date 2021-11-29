import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserTrim } from '../user-trim/user-trim.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @OneToMany((type) => UserTrim, (userTrim) => userTrim.user, { eager: true })
  userTrims: UserTrim[];
}
