import ReactShadowRoot from "react-shadow-root";

import ProductLinks from "@components/ProductLinks";
import PriceChangeGraph from "@components/PriceChangeGraph";
import ProductRating from "@components/ProductRating";

import inlineStyles from "./detail-styles";
import "./product-details.module.scss";

const icon = "/images/loading.png";

const ProductDetails = ({ product, isLoading }: ProductDetailsProps) => {
  const productChanges =
    product?.product_changes?.map((productChange) => {
      return {
        ...productChange,
        state: JSON.parse(productChange?.state || "{}"),
      } as ProductChangeWithStateObject;
    }) || [];

  return (
    <div className="product-details">
      {isLoading && (
        <span className="loading">
          <img src={icon} className="loading-icon" alt="icon" />
        </span>
      )}
      {!isLoading && product && (
        <div className="product-details__content">
          <h1 className="product-details__title">{product.title}</h1>
          <div className="product-details__body">
            <ReactShadowRoot>
              <style>{inlineStyles}</style>
              <div
                dangerouslySetInnerHTML={{ __html: product.details_html || "" }}
              ></div>
            </ReactShadowRoot>
          </div>
          <div className="product-details__additional">
            <ProductLinks product={product} />
            <PriceChangeGraph
              renderIf={productChanges.length > 0}
              priceChanges={productChanges.map(
                (productChange) =>
                  productChange && {
                    price: productChange?.state?.price || 0,
                    date_time: productChange.date_time,
                  }
              )}
            />
            <ProductRating
              renderIf={"final_rating" in product}
              finalRating={product.final_rating || 0}
              attributes={product.attrs_rating || []}
            />
          </div>
        </div>
      )}
      {!isLoading && !product && (
        <strong>No data available for this product</strong>
      )}
    </div>
  );
};

export default ProductDetails;
