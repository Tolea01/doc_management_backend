import { Resolver } from 'nestjs-i18n/dist/interfaces/resolver.interface';

export default interface I18nConfig {
  fallbackLanguage: string;
  loaderOptions: {
    path: string;
    watch: boolean;
  };
  resolvers: Resolver[];
}
