import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true, nullable: false })
  username: string;

  @Column({ name: 'password', nullable: false })
  password: string;
}
