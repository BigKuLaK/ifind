import React, { useCallback, useEffect, useRef, useState } from "react";
import { useProductDetail } from "@contexts/productContext";
import IfindLoading from "@components/IfindLoading";
import ProductLinks from "@components/ProductLinks";
import PriceChangeGraph from "@components/PriceChangeGraph";
import ProductRating from "@components/ProductRating";
import Modal from "@components/Modal";

import "./styles.module.scss";

const ProductModal = ({ product, ...modalProps }: ProductModalProps) => {
  const {
    productDetail,
    getProductDetails,
    loading = true,
  } = useProductDetail();
  const modalRef = useRef<HTMLElement>();
  const [isScrolled, setIsScrolled] = useState(false);
  const productChanges =
    productDetail?.product_changes?.map((productChange) => {
      return {
        ...productChange,
        state: JSON.parse(productChange?.state || "{}"),
      } as ProductChangeWithStateObject;
    }) || [];

  const classNames = [
    "product-modal",
    loading ? "product-modal--loading" : "",
    isScrolled ? 'product-modal--scrolled' : ''
  ]
    .filter(Boolean)
    .join(' ');

  const onScroll = useCallback((e) => {
    setIsScrolled(e.currentTarget?.scrollTop > 5);
  }, []);

  useEffect(() => {
    if (product?.id && getProductDetails) {
      getProductDetails(product?.id);
    }
  }, [product, getProductDetails]);

  // Listen to intersection to determine if modal has scrolled
  useEffect(() => {
    if (modalRef.current) {
      const modalScrollArea = modalRef.current.querySelector(
        ".ifind-modal__scrollarea"
      );
      console.log({ modalScrollArea });
      modalScrollArea?.addEventListener("scroll", onScroll);
    }
  }, [modalRef, onScroll]);

  return (
    <Modal
      className={classNames}
      {...modalProps}
      ref={modalRef as React.Ref<HTMLElement>}
    >
      <IfindLoading />
      <div className="product-modal__details">
        <div className="product-modal__image">
          <img
            src={product?.image}
            alt=""
            className="product-modal__image-blur"
          />
          <img
            src={product?.image}
            alt=""
            className="product-modal__image-preview"
          />
        </div>
        <div className="product-modal__content">
          <div className="product-modal__info">
            <h2 className="product-modal__heading">{product?.title}</h2>
            <div className="product-modal__links">
              <ProductLinks product={productDetail} />
            </div>
          </div>
          <div className="product-modal__meta">
            <div className="product-modal__rating">
              <ProductRating
                renderIf={typeof productDetail?.final_rating === "number"}
                finalRating={productDetail?.final_rating || 0}
                attributes={productDetail?.attrs_rating || []}
              />
            </div>
            <div className="product-modal__price-graph">
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
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;
