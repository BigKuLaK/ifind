declare interface AllPageParams extends OffersRouteParams {
  language?: string;
}

declare interface GlobalStateContextData {
  activeCategory?: string | number;
  setActiveCategory?: (args: any) => any;
  focusedCategory?: string | any;
  onCategoryClick?: (args: any) => any;
  focusedIndex?: number;
  dealTypeName?: string | any;
  onOffersClick?: (args: any) => any;
  spritesRendered?: boolean;
  setSpritesRendered?: (args: boolean) => any;
  toggleBodyScroll?: (args: boolean) => void;
  currentBreakpoint?: string;
  activeOffer?: string;
  setActiveOffer?: (offerCategory: string) => void;
}
