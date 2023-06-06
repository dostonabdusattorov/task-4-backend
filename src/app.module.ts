import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'jV[@`\\Ks"qH]%",\'G{ga\\1&+e0YP0]{:@<T!`I"D|SQ@s,t&8K',
      database: 'db',
      entities: [User],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
  ],
})
export class AppModule {}
