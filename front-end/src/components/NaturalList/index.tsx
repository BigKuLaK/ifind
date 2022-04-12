import {
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  lazy,
  Suspense,
} from "react";

import { GlobalStateContext } from "@contexts/globalStateContext";
import { useProductDetail } from "@contexts/productContext";
import { routeWithLanguage, useCurrentRouteConfig } from "@utilities/route";
import Item from "./item";
import Modal from "./modal";

import "./natural-list.module.scss";

const ProductDetails = lazy(
  () => import("@components/ProductDetails") as Promise<any>
);

const NaturalList = ({
  items = [],
  loading = false,
  category,
  observeItem,
  id,
  label,
  date,
}: NaturalListProps) => {
  const {
    incrementProductClick,
    productDetail: productDetailFromContext,
    getProductDetails,
  } = useProductDetail();

  const icon = "/images/loading.png";
  const [activeProduct, setActiveProduct] = useState<Product>();
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const currentRouteConfig = useCurrentRouteConfig();
  const { focusedCategory } = useContext(GlobalStateContext);
  const itemRef = useRef<HTMLDivElement | null>();
  const [isOpen, SetIsOpen] = useState(false);
  const [priceCatOpen, setPriceCatOpen] = useState(false);

  const onProductClick = useCallback(
    (product) => {
      setActiveProduct(product);
      if (incrementProductClick) {
        incrementProductClick(product.id);
      }
    },
    [setActiveProduct, incrementProductClick]
  );

  const populateProductDetails = useCallback(
    async (productID) => {
      setIsDetailsLoading(true);
      if (getProductDetails) {
        getProductDetails(productID);
      }
    },
    [getProductDetails]
  );

  const productHasDetails = useCallback(
    (productData) => (productData?.details_html ? true : false),
    []
  );

  // Merge activeProduct and productDetails from the context
  const mergeCurrentProductDetails = useCallback(() => {
    if (activeProduct) {
      setActiveProduct({
        ...activeProduct,
        ...(productDetailFromContext || {}),
      });
    }
    setIsDetailsLoading(false);
  }, [productDetailFromContext, activeProduct]);

  // When product details update from context,
  // Merge it with activeProduct
  useEffect(() => {
    mergeCurrentProductDetails();
  }, [productDetailFromContext]); // eslint-disable-line react-hooks/exhaustive-deps

  // When a product is selected,
  // Determine whether it has details
  useEffect(() => {
    if (activeProduct && !productHasDetails(activeProduct)) {
      populateProductDetails(activeProduct.id);
    }
  }, [activeProduct]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (observeItem && itemRef) {
      const unObserve = observeItem(itemRef.current);
      return unObserve;
    }
  }, [observeItem, itemRef]);

  useEffect(() => {
    if (focusedCategory === id && itemRef.current) {
      const currentScroll = window.pageYOffset;
      const { top } = itemRef.current.getBoundingClientRect();
      const targetScroll = currentScroll + (top - 63);

      window.scrollTo(0, targetScroll);
    }
    //console.log(date);
  }, [focusedCategory, id]);

  const getQuarter = (_date: string) => {
    const date = new Date(_date);
    let qtr = Math.ceil((date.getMonth() + 1) / 3);
    let yr = date.getFullYear();
    return ["Q" + qtr, "/" + yr];
  };

  const activeModal = () => {
    //if (width < 545) {
    SetIsOpen(true);
    //}
  };

  return (
    <>
      <div className="natural-list">
        {currentRouteConfig?.path === routeWithLanguage("/") ? null : (
          <>
            <div
              className="natural-list__separator"
              ref={itemRef as React.LegacyRef<HTMLDivElement>}
              data-category={id}
            >
              <span className="label">{label?.toUpperCase()}</span>

              <span className="label-2">
                {label?.toUpperCase()}
                <span
                  className={[
                    "ellipsis",
                    priceCatOpen === true ? "active" : "",
                  ].join(" ")}
                  onClick={() => setPriceCatOpen(!priceCatOpen)}
                >
                  <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                </span>
                {priceCatOpen ? (
                  <div className="price-option">
                    <button>$</button>
                    <button>$$</button>
                    <button>$$$</button>
                  </div>
                ) : null}
              </span>

              <div className="natural-list__mfd">{getQuarter(date || "")}</div>
            </div>
            <div className="left-arrow">
              <i className="fa fa-chevron-left"></i>
            </div>
            <div className="right-arrow">
              <i className="fa fa-chevron-right"></i>
            </div>
            <div className="natural-list__price-cat">
              <>
                <button>$</button>
                <button>$$</button>
                <button>$$$</button>
              </>
            </div>
          </>
        )}
        {currentRouteConfig?.path === routeWithLanguage("/findtube") ? null : (
          <>
            <Modal open={isOpen} close={() => SetIsOpen(false)}>
              {activeProduct && (
                <Suspense fallback="">
                  <ProductDetails
                    product={activeProduct}
                    isLoading={isDetailsLoading}
                  />
                </Suspense>
              )}
            </Modal>
            {loading && (
              <span className="loading">
                <img src={icon} className="loading-icon" alt="icon" />
              </span>
            )}
            <div className="natural-list__content">
              {!loading && (
                <ul className="natural-list__grid">
                  <li className="natural-list__item">
                    {activeProduct && (
                      <Suspense fallback="">
                        <ProductDetails
                          product={activeProduct}
                          isLoading={isDetailsLoading}
                        />
                      </Suspense>
                    )}
                  </li>
                  {items.map((item, index) => (
                    <Item
                      {...item}
                      active={activeProduct && activeProduct.id === item?.id}
                      withBadge={index === 0}
                      onClick={() => {
                        onProductClick(item);
                        activeModal();
                      }}
                      key={item?.id}
                      index={index}
                    />
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default NaturalList;
