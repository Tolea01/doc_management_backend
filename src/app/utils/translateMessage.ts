import { I18nService } from 'nestjs-i18n';

export const translateMessage = async (
  i18nService: I18nService,
  i18nMessage: string,
  args?: Record<string, any>,
): Promise<string> => {
  return i18nService.translate(i18nMessage, { args });
};
