declare interface OffersCategoriesContext {
  offersCategories?: OffersCategory[];
  activeOffer?: OffersCategory;
  loading?: boolean;
  offersCategoryTranslationArrayToMap: (
    translations: (OffersCategoryLabelTranslation | null)[]
  ) => TranslationMap;
}

declare interface OffersCategoriesQueryData {
  offersCategories: OffersCategory[];
}

declare interface OffersCategoriesProviderProps {
  children: ReactNode;
  offersCategories: OffersCategory[];
}

declare interface OfferCategoriesPayload {
  offersCategories: OffersCategory[];
}
