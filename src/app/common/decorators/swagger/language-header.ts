import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

export const ApiLanguageHeader = () => {
  return applyDecorators(
    ApiHeader({
      name: 'language',
      description: 'language chosen by user',
      required: false,
      schema: {
        enum: ['ro', 'ru'],
        default: process.env.DEFAULT_APP_LANGUAGE,
      },
    }),
  );
};

export default ApiLanguageHeader;
