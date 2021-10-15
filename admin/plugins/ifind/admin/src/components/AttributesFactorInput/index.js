import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Label } from '@buffetjs/core';
import { v4 as uuid } from 'uuid';

import { useProductAttributes } from '../../providers/productAttributesProvider';
import NumberInput from '../NumberInput';

import './styles.scss';

const AttributesFactorInput = ({ label, attributeFactors, onChange, className }) => {
  const { productAttributes } = useProductAttributes();
  const [ factorsInputs, setFactorInputs ] = useState([]);

  const classNames = [
    'attributes-factor-input',
    className
  ].filter(Boolean).join(' ');

  const onItemChange = useCallback((changedItemData) => {
    if ( typeof onChange !== 'function' ) {
      return;
    }

    const updatedFactorInputs = factorsInputs.map(factorInput => ({
      ...factorInput,
      factor: changedItemData.itemKey === factorInput.itemKey ? changedItemData.factor : factorInput.factor,
    }));
    onChange(updatedFactorInputs);
  }, [ factorsInputs, onChange ]);

  const getNormalizedAttrFactors = useCallback(() => {
    // Map productAttributes
    // Match category's factorInputs
    const attributesWithFactors = productAttributes.map(productAttribute => {
      const matchedCategoryAttributeFactor = attributeFactors.find(attrFactor => {
        return attrFactor && attrFactor.product_attribute && attrFactor.product_attribute.id == productAttribute.id
      });

      const itemKey = matchedCategoryAttributeFactor?.itemKey || uuid();
      const factor = matchedCategoryAttributeFactor?.factor || 1;
      const label_preview = productAttribute.name;

      return {
        id: matchedCategoryAttributeFactor?.id || null,
        itemKey,
        factor,
        label_preview,
        product_attribute: productAttribute,
      }
    });

    return attributesWithFactors;
  }, [ productAttributes, attributeFactors ]);

  useEffect(() => {
    setFactorInputs(getNormalizedAttrFactors());
  }, [ attributeFactors, productAttributes ]);

  useEffect(() => {
    if ( typeof onChange === 'function' ) {
      onChange(getNormalizedAttrFactors());
    }
  }, [ productAttributes ]);

  return (
    <div className={classNames}>
      { (label && <Label className='attributes-factor-input__label'>{label}</Label>) || ''}
      <table className="attributes-factor-input__table">
        <thead>
          <th>Attribute</th>
          <th>Factor</th>
        </thead>
        <tbody>
          {
            factorsInputs.map(attrWithFactor => (
              <tr>
                <td>
                  {attrWithFactor.label_preview}
                </td>
                <td>
                  <NumberInput
                    value={attrWithFactor.factor}
                    step="0.1"
                    onChange={(value) => onItemChange({
                      factor: Number(value),
                      itemKey: attrWithFactor.itemKey,
                    })}
                  />
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
};

AttributesFactorInput.propTypes = {
  label: PropTypes.string,
  factors: PropTypes.arrayOf(PropTypes.object), // attributesFactorComponent data
  onChange: PropTypes.func,
  className: PropTypes.string,
};

AttributesFactorInput.defaultProps = {
  factors: [],
  onChange: () => {},
  className: '',
};

export default AttributesFactorInput;