import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuid } from 'uuid';

import { useCategoriesListing } from '../../providers/categoriesListingProvider';
import { useProductAttributes } from '../../providers/productAttributesProvider';
import RatingWarps from '../RatingWarps';
import AttributeRating from './attribute-rating';

import './styles.scss';

const ProductAttributesRating = ({ category, productData, attributesRatings = [], onAttributesChange, onFinalRatingChange, className }) => {
  const { categories } = useCategoriesListing();
  const { productAttributes } = useProductAttributes();
  const [ attrsDetails, setAttrsDetails ] = useState([]);
  const [ totalRating, setTotalRating ] = useState(0);

  const onAttrRatingChange = useCallback((changedAttrRating) => {
    // Updated changed attrDetail
    const newAttrDetails = attrsDetails.map(attrDetail => {
      return attrDetail.product_attribute.id === changedAttrRating.product_attribute.id ?
      {
        ...attrDetail,
        ...changedAttrRating,
      } : 
      attrDetail
    });

    if ( typeof onAttributesChange === 'function' ) {
      onAttributesChange(newAttrDetails);
    }
  }, [ attrsDetails, onAttributesChange ]);

  useEffect(() => {
    // - Get category product attrs
    //    - If none, use productAttributes
    // - Apply ratings from attributesRatings
    //    - If none, apply 1 for each attribute

    const matchedCategory = category ? categories.find(({ id }) => id === category) : null;
    const attrsWithFactors = matchedCategory?.product_attrs?.length ? matchedCategory.product_attrs : (
      (productAttributes || []).map(attr => ({
        product_attribute: attr,
        factor: 1,
      }))
    );

    // Supply rating and id from product's attributesRatings
    const attrsWithWithRatings = attrsWithFactors.map(attrWithFactor => {
      const matchedProductRating = attributesRatings.find(attrRating => (
        attrRating.product_attribute.id === attrWithFactor.product_attribute.id
      ));

      // Apply rating and id if there is any from product's rating
      if ( matchedProductRating ) {
        attrWithFactor.id = matchedProductRating.id;
        attrWithFactor.rating = matchedProductRating.rating;
        attrWithFactor.enabled = matchedProductRating.enabled;
        attrWithFactor.use_custom_formula = matchedProductRating.use_custom_formula;
        attrWithFactor.min = matchedProductRating.min;
        attrWithFactor.max = matchedProductRating.max;
      }
      // Else, apply defaults
      else {
        delete attrWithFactor.id;
        attrWithFactor.rating = 0;
        attrWithFactor.enabled = true;
      }

      // Add other attribute props
      attrWithFactor.data_type = attrWithFactor.product_attribute?.data_type || 'number';
      attrWithFactor.custom_formula = attrWithFactor.product_attribute?.custom_formula || '';

      // Add itemKey
      attrWithFactor.itemKey = matchedProductRating?.itemKey || uuid();

      // Compute points
      attrWithFactor.points = Number(attrWithFactor.rating) * Number(attrWithFactor.factor);

      return attrWithFactor;
    });

    setAttrsDetails([...attrsWithWithRatings]);
  }, [ categories, productAttributes, category, attributesRatings ]);

  // Set total points according to product attributes factors
  useEffect(() => {
    if ( attrsDetails.length ) {
      let totalPoints = 0;
      let totalRating = 0;

      attrsDetails.forEach((attrDetail) => {
        if ( attrDetail.enabled ) {
          totalPoints += Number(attrDetail.factor) * 10;
          totalRating += attrDetail.points;
        }
      });

      const finalRating = Number((10 * totalRating / (totalPoints || 1)).toFixed(1));
      setTotalRating(finalRating);

      if ( typeof onFinalRatingChange === 'function' ) {
        onFinalRatingChange(finalRating);
      }
    }
  }, [ attrsDetails ]);

  return (
    <div className={[
      'product-attributes-rating',
      className
    ].join(' ')}>

      {/* Totals */}
      <div className="product-attributes-rating__total">
        <strong>Rating:</strong>
        <div className="product-attributes-rating__figure">
          <RatingWarps percentage={100 * totalRating / 10} />
          <strong className="product-attributes-rating__ratio">{totalRating}/10</strong>
        </div>
      </div>

      <table className="product-attributes-rating__table">
        <thead>
          <th></th>
          <th>Attribute</th>
          <th>Rating</th>
          <th></th>
          <th></th>
          <th>Factor</th>
          <th>Points</th>
        </thead>
        <tbody>
          {
            attrsDetails.map(attrRating => (
              <AttributeRating
                {...attrRating}
                key={attrRating.itemKey}
                itemKey={attrRating.itemKey}
                productData={productData}
                onChange={changedRating => onAttrRatingChange(changedRating)}
                />
            ))
          }
        </tbody>
      </table>
    </div>
  )
};

export default ProductAttributesRating;