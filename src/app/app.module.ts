import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppConfig from 'config/app.config';
import AllModules from './modules';
import { I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    ...AllModules,
    AppConfig.setupConfigModule(),
    TypeOrmModule.forRoot(AppConfig.databaseConnection()),
    I18nModule.forRoot(AppConfig.getI18nConfig()),
  ],
})
export class AppModule {}
