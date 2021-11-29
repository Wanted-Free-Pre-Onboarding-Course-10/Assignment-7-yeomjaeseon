import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/ormconfig';
import { UserModule } from './user/user.module';
import { TireModule } from './tire/tire.module';
import { TrimModule } from './trim/trim.module';
import { UserTrimModule } from './user-trim/user-trim.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    TireModule,
    TrimModule,
    UserTrimModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
