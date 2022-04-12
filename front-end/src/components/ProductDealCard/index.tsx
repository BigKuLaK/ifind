import { useEffect, useState, useCallback } from "react";
import dealTypes from "@config/deal-types";

import PercentCircle from "@components/PercentCircle";
import RatingWarps from "@components/RatingWarps";

import "./styles.module.scss";

const ProductDealCard: ProductDealCardComponent = ({
  id,
  title,
  image,
  deal_type,
  deal_merchant,
  amazon_url,
  url_list,
  price,
  price_original,
  discount_percent,
  quantity_available_percent,
  final_rating,
  onClick,
  additional_info = "stocks_available",
}) => {
  const [productURL, setProductURL] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string | null>(null);
  const [originalPrice, setOriginalPrice] = useState<number>();
  const [discountPercent, setDiscountPercent] = useState<number>();
  const [stockPercent, setStockPercent] = useState<number>();

  const getProductDetails = useCallback(() => {
    // Use default product details if deal_merchant/deal_type is amazon, mydealz, or none
    if (
      !deal_type ||
      /amazon|none/.test(deal_merchant as string) ||
      /amazon|none/.test(deal_type as string)
    ) {
      setProductURL(amazon_url || "");
      setProductPrice(String(price));
      setOriginalPrice(price_original);
      setDiscountPercent(discount_percent);
      setStockPercent(quantity_available_percent);
    } else {
      // Determine url and price according to product.deal_type
      const [dealKey, dealData] =
        Object.entries(dealTypes as DealTypeSiteMap).find(
          ([key, deal]) => deal.site === deal_merchant || key === deal_type
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
          setOriginalPrice(matchedOtherSiteDetails.price_original);
          setDiscountPercent(matchedOtherSiteDetails.discount_percent);
          setStockPercent(matchedOtherSiteDetails.quantity_available_percent);
        }
      }
    }
  }, [
    deal_type,
    deal_merchant,
    amazon_url,
    url_list,
    price,
    price_original,
    discount_percent,
    quantity_available_percent,
  ]);

  const onCardClick = useCallback(
    (e) => {
      if (typeof onClick === "function") {
        e.preventDefault();

        onClick({
          id,
          title,
          image,
          amazon_url,
          url_list,
          price,
        } as Product);
      }
    },
    [onClick, id, title, image, amazon_url, url_list, price]
  );

  useEffect(() => {
    getProductDetails();
  }, [deal_type, getProductDetails]);

  return (
    <a
      className="product-deal-card"
      href={productURL}
      target="_blank"
      rel="noreferrer"
      onClick={onCardClick}
    >
      <div className="product-deal-card__content">
        {discountPercent ? (
          <div className="product-deal-card__discount">{`-${discountPercent}%`}</div>
        ) : (
          ""
        )}
        <div className="product-deal-card__image">
          <img src={image} alt="" />
        </div>
        <div className="product-deal-card__details">
          <div className="product-deal-card__title">{title}</div>
          <div className="product-deal-card__deal-info">
            <div className="product-deal-card__price">
              {originalPrice ? (
                <small className="product-deal-card__price-original">
                  {" "}
                  €{originalPrice}{" "}
                </small>
              ) : (
                ""
              )}
              <strong className="product-deal-card__price-discounted">
                €{productPrice}
              </strong>
            </div>
            <PercentCircle
              renderIf={additional_info === "stocks_available"}
              percent={stockPercent === null ? null : stockPercent || null}
            />
            <RatingWarps
              renderIf={additional_info === "rating"}
              rating={final_rating || 0}
            />
          </div>
        </div>
      </div>
    </a>
  );
};

export default ProductDealCard;
