import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AppConfig from 'src/config/app-config';

@Module({
  imports: [AppConfig.EnvConfig()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
