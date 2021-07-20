import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Toggle, Button } from '@buffetjs/core';
import { Tooltip } from '@buffetjs/styles';

import RatingWarpsControl from '../RatingWarpsControl';
import NumberInput from '../NumberInput';
import IFINDIcon from '../IFINDIcon';
import AttributeMinMaxInput from '../AttributeMinMaxInput';

const RATING_INCREMENTS = 0.5;

const AttributeRating = ({ product_attribute, factor, rating = 0, points, enabled, custom_formula, use_custom_formula, data_type, min, max, onChange, itemKey }) => {
  const onItemChange = useCallback((changes) => {
    if ( typeof onChange === 'function' ) {
      onChange({
        product_attribute,
        factor,
        rating,
        points,
        enabled,
        custom_formula,
        use_custom_formula,
        ...changes,
      });
    }
  }, [
    onChange,
    product_attribute,
    factor,
    rating,
    points,
    enabled,
    custom_formula,
    use_custom_formula,
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
    console.log({ minMax });
  }, []);

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
          data-tip={ use_custom_formula ? 'Using custom function' : 'Using normal computation' }
          icon={<IFINDIcon icon='function' />}
          onClick={toggleUseCustomFormula}
        />
      </td>
      <td>{factor}</td>
      <td>{Number(points.toFixed(2))}</td>
    </tr>,
    use_custom_formula && enabled ? (
      <tr>
        <td colSpan='3' />
        <td colSpan='2'>
          <AttributeMinMaxInput value={min} type={data_type} onChange={(value => onMinMaxChange({ value, max }))} />
          <AttributeMinMaxInput value={max} type={data_type} onChange={(value => onMinMaxChange({ min, value }))} />
        </td>
        <td colSpan='2'></td>
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