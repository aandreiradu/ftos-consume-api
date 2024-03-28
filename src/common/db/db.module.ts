import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/users.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        database: configService.get('MYSQL_DATABASE'),
        username: configService.get('MYSQL_ROOT_USER'),
        password: configService.get('MYSQL_ROOT_PASSWORD'),
        synchronize: configService.get('MYSQL_SYNCHRONIZE') ?? false,
        entities: [User],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
