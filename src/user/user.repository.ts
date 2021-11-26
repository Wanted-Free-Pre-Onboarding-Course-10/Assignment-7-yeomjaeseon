import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserDuplicateException } from '../exception/user_duplicate_exception';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  // == 유저 생성 == //
  async createUser(username: string, password: string): Promise<void> {
    const user = this.create({
      username,
      password,
    });

    try {
      await this.save(user);
    } catch (err) {
      if (err.errno === 19) throw new UserDuplicateException();
      else throw new InternalServerErrorException();
    }
  }
}
