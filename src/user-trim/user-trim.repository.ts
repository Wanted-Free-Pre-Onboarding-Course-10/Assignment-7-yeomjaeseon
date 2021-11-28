import { EntityRepository, Repository } from 'typeorm';
import { UserTrim } from './user-trim.entity';
import { Logger } from '@nestjs/common';
import { Trim } from '../trim/trim.entity';
import { User } from '../user/user.entity';

@EntityRepository(UserTrim)
export class UserTrimRepository extends Repository<UserTrim> {
  private logger = new Logger('UserTrimRepository');

  async saveUserTrim(user: User, trim: Trim) {
    const userTrim = this.create({ user, trim });

    await this.save(userTrim);
  }

  async findUserTrimById(id: number) {
    const userTrims = await this.find({ relations: ['trim'], where: { id } });

    return userTrims;
  }
}
