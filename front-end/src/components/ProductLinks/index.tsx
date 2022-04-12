import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useSourceRegion } from "@contexts/sourceRegionContext";

import ProductURLLink from "./product-url-link";

import "./styles.module.scss";

const ProductLinks = ({ product }: ProductLinksProps) => {
  const { sources } = useSourceRegion();
  const [urlItems, setURLItems] = useState<URLListItemWithKey[]>([]);
  const amazonSource = sources?.find((source) => /amazon/i.test(source.name));

  useEffect(() => {
    // Add keys to urlList
    if (product?.url_list) {
      const urlItems: URLListItemWithKey[] = product.url_list?.map((urlData) => ({
        ...urlData,
        id: urlData?.id || '',
        key: uuid(),
      }));

      // Add amazon details
      if ( product?.amazon_url ) {
        urlItems.push({
          id: product.id,
          key: uuid(),
          url: product.amazon_url,
          source: amazonSource,
          price: product?.price,
          region: product?.region,
          is_base: true,
        });
      }

      // Sort items by price, ascending
      urlItems.sort((dataA, dataB) => (dataA.price || 0) < (dataB.price || 0) ? -1 : 1);

      setURLItems(urlItems as URLListItemWithKey[]);
    }
  }, [product, amazonSource]);

  return (
    <div className="product-links">
      {urlItems.map(({ key, url, source, price, is_base }) => (
        <ProductURLLink
          key={key}
          url={url}
          source={source?.name}
          logo={source?.button_logo?.url}
          price={price || 0}
          basePrice={product?.price || 1}
          currency={product?.region?.currency?.symbol}
          isBase={is_base}
        />
      ))}
    </div>
  );
};

export default ProductLinks;
