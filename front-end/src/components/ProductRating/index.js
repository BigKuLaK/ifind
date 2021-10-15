import RatingWarps from "@components/RatingWarps";
import AttributesTable from "@components/AttributesTable";

import './styles.scss';

const ProductRating = ({ finalRating, attributes }) => {
    return (
        <div className="product-rating">
            <strong className="rating-warps__title">Rating:</strong>
            <RatingWarps rating={finalRating} />
            <span className="rating-warps__numeric">{finalRating}/10</span>

            <div className="product-rating__tooltip">
                <AttributesTable attributes={attributes} />
            </div>
        </div>
    )
}

export default ProductRating;