export type UiStrings = Record<string, string>;
export type ContentTranslations = Record<string, string>;

export interface ContentTranslationParams {
  locale: string;
  entityType: string;
  entityId?: string;
}