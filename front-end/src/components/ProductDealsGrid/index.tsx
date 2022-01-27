import { useContext, useEffect, useRef, useCallback, useState } from "react";
import { GlobalStateContext } from "@contexts/globalStateContext";
import ProductDealCard from "@components/ProductDealCard";
import { useTranslation } from "@translations";
import RenderIf from "@components/RenderIf";

import { updatedTime } from "./translations";

import "./styles.scss";

const INITIAL_PRODUCTS_IN_VIEW = 20;
const PRODUCTS_PER_LOAD = 10;

const ProductDealsGrid: ProductDealsGridComponent = ({
  products,
  deal_type,
  total_products = 0,
}) => {
  const translate = useTranslation();
  const { dealTypeName } = useContext(GlobalStateContext);
  const offersRef = useRef<HTMLDivElement | null>();
  const [productsInView, setProductsInView] = useState<Product[]>(
    products.slice(0, INITIAL_PRODUCTS_IN_VIEW)
  );

  const translationArrayToMap = useCallback(
    (
      translationsArray: Array<DealTypeLabelTranslation | null> = []
    ): TranslationMap => {
      const translationMap: TranslationMap = {};

      translationsArray.forEach((label) => {
        if (label) {
          translationMap[label.language] = label.label as string;
        }
      });

      return translationMap;
    },
    []
  );

  const onLoadMoreClick = useCallback(
    (e) => {
      e.preventDefault();

      const productsInViewCount = productsInView.length;

      setProductsInView(
        products.slice(0, productsInViewCount + PRODUCTS_PER_LOAD)
      );
    },
    [products, productsInView]
  );

  useEffect(() => {
    if (dealTypeName === "amazon_flash_offers") {
      return window.scrollTo(0, 0);
    }

    if (dealTypeName === deal_type.name && offersRef.current) {
      const currentScroll = window.pageYOffset;
      const { top } = offersRef.current.getBoundingClientRect();
      const targetScroll = currentScroll + (top - 60);

      window.scrollTo(0, targetScroll);
    }
  }, [dealTypeName, deal_type.name]);

  return (
    <div
      className="product-deals-grid"
      ref={offersRef as React.LegacyRef<HTMLDivElement>}
      data-category={deal_type.name}
    >
      <div className="product-deals-grid__heading">
        {translate(translationArrayToMap(deal_type.label || []))}
        <RenderIf condition={deal_type.last_run ? true : false}>
          <aside className="product-deals-grid__update-time">
            {translate(updatedTime, { TIME: deal_type.last_run })}
          </aside>
        </RenderIf>
      </div>
      {products.length ? (
        <div className="product-deals-grid__items">
          {productsInView.map((product) => (
            <ProductDealCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <p className="product-deals-grid__empty">No products yet.</p>
      )}
      <RenderIf condition={productsInView.length < total_products}>
        <div className="product-deals-grid__load-more">
          <button
            className="product-deals-grid__load-more-button"
            onClick={onLoadMoreClick}
          >
            Load More Offers
          </button>
        </div>
      </RenderIf>
    </div>
  );
};

export default ProductDealsGrid;
