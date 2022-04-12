import RatingWarps from "@components/RatingWarps";
import AttributesTable from "@components/AttributesTable";

import withConditionalRender from "@utilities/hocs/withConditionalRender";

import "./styles.module.scss";

const ProductRating = ({ finalRating, attributes }: ProductRatingProps) => {
  return (
    <div className="product-rating">
      <div className="product-rating__content">
      <strong className="rating-warps__title">Rating:</strong>
      <RatingWarps renderIf={true} rating={finalRating} />
      <span className="rating-warps__numeric">{finalRating}/10</span>
      </div>

      <div className="product-rating__tooltip">
        <AttributesTable attributes={attributes} />
      </div>
    </div>
  );
};

export default withConditionalRender<ProductRatingProps>(ProductRating);
