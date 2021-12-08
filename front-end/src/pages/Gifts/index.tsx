import { useCallback } from "react";
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

import "./styles.scss";

const Gifts = () => {
  const { tags = '' } = useSearchParams();
  const { loading: isTagsLoading } = useTags();
  const { pathname, search } = useLocation();
  const history = useHistory();
  const {
    products,
    total = 0,
    loading: isGiftsLoading,
  }: GiftIdeasContextData = useGiftIdeas();
  const selectedTags = tags.split(',').filter(Boolean);

  const onTagsUpdate = useCallback(
    (tags: (string | number)[]) => {
      history.push(addURLParams(pathname + search, { tags, page: 1 }));
    },
    [history, pathname, search]
  );

  const classNames = [
    "gifts container",
    isGiftsLoading || isTagsLoading ? "gifts--loading" : "",
  ].filter(Boolean).join(' ');

  return (
    <GeneralTemplate>
      <div className={classNames}>
        <div className="gifts__columns">
          <TagsFilter selectedTags={selectedTags} onUpdate={onTagsUpdate} />
          <div className="gifts__products">
            <div className="gifts__products-grid">
              {products?.map((product) => (
                <ProductDealCard key={product.id} {...product} />
              ))}
            </div>
            <div className="gifts__products-pagination">
              <Pagination totalPages={Math.ceil(total / 20)} />
            </div>
          </div>
        </div>
        <IfindLoading />
      </div>
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
