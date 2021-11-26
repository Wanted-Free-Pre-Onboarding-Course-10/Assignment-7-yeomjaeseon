import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { JwtStrategy } from './jwt/jwt.strategy';

config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }), //passport 기본전략 : jwt를 사용할것.
    JwtModule.register({
      secret: process.env.JWT_SECRET, // 서버에서 유일하게 간직해야하는 secret - 요청온 jwt 토큰의 유효성을 위해
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES, // 토큰의 만료 기간 (1시간)
      },
    }),
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [JwtStrategy, PassportModule],
})
export class UserModule {}
