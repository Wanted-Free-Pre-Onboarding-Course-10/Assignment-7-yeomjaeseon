import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Trim } from '../trim/trim.entity';

@Entity()
export class UserTrim {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne((type) => User, (user) => user.userTrims)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne((type) => Trim, (trim) => trim.userTrims)
  @JoinColumn({ name: 'trim_id' })
  trim: Trim;
}
