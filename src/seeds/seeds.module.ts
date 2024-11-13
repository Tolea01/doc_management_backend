import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomingDocument } from 'app/modules/incoming_documents/entities/incoming_document.entity';
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
import { IncomingDocumentSeeder } from './seeders/incoming_document.seeder';
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
    TypeOrmModule.forFeature([User, Person, IncomingDocument]),
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
  providers: [UserSeeder, PersonSeeder, IncomingDocumentSeeder],
})
export class SeedsModule {}
