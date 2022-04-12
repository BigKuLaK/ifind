import { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import GeneralTemplate from "@templates/GeneralTemplate";
import { withComponentName } from "@utilities/component";
import { addURLParams, useSearchParams } from "@utilities/url";
import { useGiftIdeas, GiftIdeasProvider } from "@contexts/giftIdeasContext";
import { TagsProvider, useTags } from "@contexts/tagsContext";

import TagsFilter from "@components/TagsFilter";
import ProductDealCard from "@components/ProductDealCard";
import Pagination from "@components/Pagination";
import IfindLoading from "@components/IfindLoading";
import ProductModal from "@components/ProductModal";

import "./styles.module.scss";

const Gifts = () => {
  const { tags = "all" } = useSearchParams();
  const { loading: isTagsLoading } = useTags();
  const { pathname, search } = useLocation();
  const history = useHistory();
  const {
    products,
    total = 0,
    loading: isGiftsLoading,
  }: GiftIdeasContextData = useGiftIdeas();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product>();
  const [activeTag = null] = tags.split(",").filter(Boolean);

  const onTagsUpdate = useCallback(
    (activeTag: string | number) => {
      history.push(
        addURLParams(pathname + search, {
          tags: activeTag ? [activeTag] : [],
          page: 1,
        })
      );
    },
    [history, pathname, search]
  );

  const onCardClick = useCallback((product?: Product) => {
    setActiveProduct(product);
    setModalVisible(true);
  }, []);

  const onModalClose = useCallback(() => {
    setModalVisible(false);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [products]);

  const classNames = [
    "gifts",
    isGiftsLoading || isTagsLoading ? "gifts--loading" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <GeneralTemplate>
      <div className={classNames}>
        <div className="gifts__container">
          <div className="gifts__columns">
            <TagsFilter activeTag={activeTag} onUpdate={onTagsUpdate} />
            <div className="gifts__products">
              <div className="gifts__products-grid">
                {products?.map((product) => (
                  <ProductDealCard
                    key={product.id}
                    {...product}
                    onClick={onCardClick}
                    additional_info="rating"
                  />
                ))}
              </div>
              <div className="gifts__products-pagination">
                <Pagination totalPages={Math.ceil(total / 20)} />
              </div>
            </div>
          </div>
          <IfindLoading />
        </div>
      </div>
      <ProductModal
        product={activeProduct}
        visible={modalVisible}
        onClose={onModalClose}
      />
    </GeneralTemplate>
  );
};

const WrappedGiftsPage = () => (
  <TagsProvider>
    <GiftIdeasProvider>
      <Gifts />
    </GiftIdeasProvider>
  </TagsProvider>
);

export default withComponentName("GiftsPage")(WrappedGiftsPage);
