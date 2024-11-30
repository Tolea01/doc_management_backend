import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryDocument } from 'app/modules/entry_documents/entities/entry_document.entity';
import { InternalDocument } from 'app/modules/internal_documents/entities/internal_document.entity';
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
import { EntryDocumentSeeder } from './seeders/entry_document.seeder';
import { InternalDocumentSeeder } from './seeders/internal_document.seeder';
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
    TypeOrmModule.forFeature([User, Person, EntryDocument, InternalDocument]),
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
  providers: [
    UserSeeder,
    PersonSeeder,
    EntryDocumentSeeder,
    InternalDocumentSeeder,
  ],
})
export class SeedsModule {}
