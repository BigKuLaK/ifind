/**
 TODO:

 - Clean up URLType Select once removed from implementation
 - Determine issue where the CategorySelect is empty when initially shown when filters are present in searchParams
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@buffetjs/core';

import { useSearchParams, generatePluginLink } from '../../helpers/url';

import URLTypeSelect from '../URLTypeSelect';
import CategorySelect from '../CategorySelect';

import './styles.scss';

const ProductFilters = ({ onChange }) => {
  const searchParams = useSearchParams();
  const history = useHistory();

  // States
  const [ category, setCategory ] = useState('');

  const onCategorySelect = useCallback((categoryID) => {
    setCategory(categoryID);
  }, [  ]);

  const applyFilters = useCallback(() => {
    const targetURL = generatePluginLink('', { category });
    history.push(targetURL);
  }, [ category ])

  const clearFilters = useCallback(() => {
    const targetURL = generatePluginLink('', { category: '' });
    history.push(targetURL);
  }, []);

  useEffect(() => {
    const { category } = searchParams;
    setCategory(category)
  }, [ searchParams ]);
  
  return (
    <div className="product-filters">
      <div className="product-filters__item">
        <CategorySelect
          category={category}
          onChange={onCategorySelect}
          emptyMessage="Please select URL Type"
        />
      </div>
      <div className="product-filters__item">
        <Button
          type="submit"
          label="Apply"
          onClick={applyFilters}
        />
        &nbsp;
        {
          category ? (
            <Button
              type="submit"
              color="secondary"
              label="Clear"
              onClick={clearFilters}
            />
          ): null
        }
      </div>
    </div>
  )
};

export default ProductFilters;