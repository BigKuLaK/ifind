import { useEffect, useState, useCallback } from "react";
import dealTypes from "@config/deal-types";

const ProductDealItem: ProductDealItemComponent = ({
  title,
  image,
  deal_type,
  amazon_url,
  url_list,
  price,
}) => {
  const [productURL, setProductURL] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string | null>(null);

  const getProductDetails = useCallback(() => {
    // Use default product details if amazon
    if (/amazon/.test(deal_type as string)) {
      setProductURL(amazon_url || "");
      setProductPrice(String(price));
    } else {
      // Determine url and price according to product.deal_type
      const [dealKey, dealData] =
        Object.entries(dealTypes as DealTypeMap).find(
          ([key]) => key === deal_type
        ) || [];

      if (dealKey) {
        const matchedOtherSiteDetails = url_list?.find((otherSiteDetails) =>
          new RegExp(dealData?.site || "no-match-name", "i").test(
            otherSiteDetails?.source?.name || ""
          )
        );

        if (matchedOtherSiteDetails) {
          setProductURL(matchedOtherSiteDetails.url || "");
          setProductPrice(String(matchedOtherSiteDetails.price));
        }
      }
    }
  }, [deal_type, amazon_url, url_list, price]);

  useEffect(() => {
    getProductDetails();
  }, [deal_type]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <a className="product-deal-item" href={productURL}>
      <div className="product-deal-item__image">
        <img src={image} alt="" />
      </div>
      <div className="product-deal-item__details">
        <div className="product-deal-item__title">{title}</div>
        <strong className="product-deal-item__price">€ {productPrice}</strong>
      </div>
    </a>
  );
};

export default ProductDealItem;
