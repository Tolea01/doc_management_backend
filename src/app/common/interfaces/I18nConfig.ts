export interface Resolver {
  use: any;
  options: string[];
}

export default interface I18nConfig {
  fallbackLanguage: string;
  loaderOptions: {
    path: string;
    watch: boolean;
  };
  resolvers: Resolver[];
}
