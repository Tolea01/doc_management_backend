import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from 'app/modules/person/entities/person.entity';
import { User } from 'app/modules/user/entities/user.entity';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import AppConfig from 'src/config/app.config';
import AllModules from '../app/modules';
import { PersonSeeder } from './seeders/person.seeder';
import { UserSeeder } from './seeders/user.seeder';

@Module({
  imports: [
    ...AllModules,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => new AppConfig().databaseConnection(),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Person]),
    I18nModule.forRootAsync({
      useFactory: () => new AppConfig().getI18nConfig(),
      resolvers: [
        new QueryResolver(['lang']),
        new HeaderResolver(['language']),
        new AcceptLanguageResolver(),
      ],
      inject: [ConfigService],
    }),
  ],
  providers: [UserSeeder, PersonSeeder],
})
export class SeedsModule {}
