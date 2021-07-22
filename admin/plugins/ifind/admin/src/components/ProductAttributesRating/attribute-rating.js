import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Toggle, Button } from '@buffetjs/core';
import moment from 'moment';

import RatingWarpsControl from '../RatingWarpsControl';
import NumberInput from '../NumberInput';
import IFINDIcon from '../IFINDIcon';
import AttributeMinMaxInput from '../AttributeMinMaxInput';
import TextInput from '../TextInput';

const RATING_INCREMENTS = 0.5;

const applyCustomFormula = (customFormula = '', data, dataType = 'number') => {
  const today = moment.utc();

  const formulaWithData = Object.entries(data).reduce((updatedFormula, [ key, data ]) => {
    let processedData = data;

    if ( dataType === 'date_time' ) {
      switch (key) {
        case 'max':
        case 'min':
        case 'release_date':
          // Compute days from today to min/max/release_date
          const millisecondsAgo = today.valueOf() - moment.utc(data).valueOf();
          processedData = Math.floor(millisecondsAgo / 1000 / 60 / 60 / 24);
          processedData = !isNaN(processedData) ? processedData : 0;
          break;
        default:;
      }
    }

    const substitutedFormula = updatedFormula.replace(new RegExp(key, 'g'), processedData);
    return substitutedFormula;
  }, customFormula);

  const computedRating = eval(formulaWithData);

  // Ensure rating is >= 0 and <= 10
  if ( computedRating <= 0 ) {
    return 0;
  }
  else if ( computedRating >= 10 ) {
    return 10
  }

  return computedRating;
}

const AttributeRating = ({ product_attribute, factor, rating = 0, points, enabled, custom_formula, use_custom_formula, data_type, min, max, onChange, productData }) => {
  const onItemChange = useCallback((changes) => {
    if ( typeof onChange === 'function' ) {
      const newData = {
        product_attribute,
        factor,
        rating,
        points,
        enabled,
        custom_formula,
        use_custom_formula,
        min,
        max,
        ...changes,
      };

      // Use custom formula if selected
      if ( newData.use_custom_formula && newData.custom_formula && newData.max ) {
        newData.rating = applyCustomFormula(newData.custom_formula, {
          ...newData,
          ...productData,
        }, product_attribute.data_type);
      }

      onChange(newData);
    }
  }, [
    onChange,
    productData,
    product_attribute,
    factor,
    rating,
    points,
    enabled,
    custom_formula,
    use_custom_formula,
    min,
    max,
  ]);

  const onRatingChange = useCallback((newRating) => {
    if ( typeof onChange === 'function' ) {
      const rating = Number(Number(newRating).toFixed(3));
      const normalizedRating = rating >= 10 ? 10 :
                               rating <= 0 ? 0 :
                               rating;

      onItemChange({
        rating: normalizedRating,
        points: Number(factor) * rating,
      });
    }
  }, [ onItemChange ]);

  const onEnabledChange = useCallback((isEnabled) => {
    onItemChange({
      enabled: isEnabled,
    });
  }, [ onItemChange ]);

  const toggleUseCustomFormula = useCallback(() => {
    onItemChange({
      use_custom_formula: !use_custom_formula
    });
  }, [ onItemChange, use_custom_formula ]);

  const onMinMaxChange = useCallback((minMax) => {
    onItemChange(minMax);
  }, [ onItemChange ]);

  const classNames = [
    'attribute-rating',
    !enabled ? 'attribute-rating--disabled' : '',
  ].filter(Boolean).join(' ');

  return [
    <tr className={classNames}>
      <td>
        <Toggle
          className='attribute-rating__toggle'
          onChange={({ target: { value } }) => onEnabledChange(value)}
          value={enabled}
        />
      </td>
      <td><strong>{product_attribute.name}</strong></td>
      <td>
        <NumberInput
          className="attribute-rating__input"
          value={Number(rating.toFixed(2))}
          onChange={value => onRatingChange(value)}
          max={10}
          step={RATING_INCREMENTS}
          disabled={use_custom_formula}
        />
      </td>
      <td>
        <RatingWarpsControl
          rating={rating}
          onChange={newRating => onRatingChange(newRating)} />
      </td>
      <td>
        <Button
          className='attribute-rating__formula-toggle'
          color={ use_custom_formula ? 'primary' : 'cancel' }
          data-tip={ use_custom_formula ? 'Using custom formula' : 'Using normal computation' }
          icon={<IFINDIcon icon='function' />}
          onClick={toggleUseCustomFormula}
          disabled={custom_formula ? false : true}
        />
      </td>
      <td>{factor}</td>
      <td>{Number(points.toFixed(2))}</td>
    </tr>,
    use_custom_formula && enabled ? (
      <tr>
        <td colSpan='7'>
          <div className='attribute-rating__custom-formula'>
            <TextInput label='Custom Formula' className='attribute-rating__formula-preview' value={custom_formula} disabled />
            <div className='attribute-rating__min-max'>
              <AttributeMinMaxInput label='Min' value={min} type={data_type} onChange={(min => onMinMaxChange({ min, max }))} />
              <AttributeMinMaxInput label='Max' value={max} type={data_type} onChange={(max => onMinMaxChange({ min, max }))} />
            </div>
          </div>
        </td>
      </tr>
    ) : null
  ]
};

AttributeRating.propTypes = {
  enabled: PropTypes.bool,
};

AttributeRating.defaultProps = {
  enabled: true,
};

export default AttributeRating;