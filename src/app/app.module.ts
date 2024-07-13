import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppConfig from 'config/app.config';
import AllModules from './modules';

@Module({
  imports: [
    ...AllModules,
    AppConfig.setupConfigModule(),
    TypeOrmModule.forRoot(AppConfig.databaseConnection()),
  ],
})
export class AppModule {}
