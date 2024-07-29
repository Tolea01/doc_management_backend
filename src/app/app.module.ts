import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppConfig from 'config/app.config';
import AllModules from './modules';
import { I18nModule } from 'nestjs-i18n';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    ...AllModules,
    AppConfig.setupConfigModule(),
    TypeOrmModule.forRoot(AppConfig.databaseConnection()),
    I18nModule.forRoot(AppConfig.getI18nConfig()),
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
