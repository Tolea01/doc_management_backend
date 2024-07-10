import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppConfig from 'config/app.config';

@Module({
  imports: [
    AppConfig.setupConfigModule(),
    TypeOrmModule.forRoot(AppConfig.databaseConnection()),
  ],
})
export class AppModule {}
