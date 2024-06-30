import { Module } from '@nestjs/common';
import AppConfig from 'config/app.config';
import TypeormConfig from 'database/config/typeorm.config';

@Module({
  imports: [AppConfig.setupConfigModule(), TypeormConfig],
})
export class AppModule {}
