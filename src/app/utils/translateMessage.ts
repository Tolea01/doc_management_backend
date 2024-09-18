import { I18nService, I18nContext } from 'nestjs-i18n';

export const translateMessage = async (
  i18nService: I18nService,
  i18nMessage: string,
  args?: Record<string, any>,
): Promise<string> => {
  return i18nService.translate(i18nMessage, {
    lang: I18nContext.current().lang,
    args,
  });
};
