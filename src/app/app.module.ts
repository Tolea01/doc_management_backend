import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppConfig from 'config/app.config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import AllModules from './modules';

@Module({
  imports: [
    ...AllModules,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => new AppConfig().databaseConnection(),
      inject: [ConfigService],
    }),
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
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
