import React, { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { generatePluginLink, useSearchParams } from '../../helpers/url';
import { Select, Label } from '@buffetjs/core';

import './styles.scss';

const SortControls = ({ options = [], onSortUpdate, sortByKey = 'sort_by', orderKey = 'order' }) => {
  const searchParams = useSearchParams();
  const [ sortBy, setSortBy ] = useState(searchParams[sortByKey] || 'id');
  const [ order, setOrder ] = useState(searchParams[orderKey] || 'desc');

  useEffect(() => {
    if ( typeof onSortUpdate === 'function' ) {
      onSortUpdate({
        [sortByKey]: sortBy,
        [orderKey]: order,
      });
    }
  }, [ sortBy, order ]);

  return (
    <div className="sort-controls">
      <div className="sort-controls__control">
        <Label for="sort-control-sortby">Sort By</Label>
        <Select
          name="sort-by"
          id="sort-control-sortby"
          onChange={({ target: { value } }) => {
            setSortBy(value);
          }}
          options={options}
          value={sortBy}
        />
      </div>
      <div className="sort-controls__control">
        <Label for="sort-control-order">Order</Label>
        <Select
          name="sort-order"
          id="sort-control-order"
          onChange={({ target: { value } }) => {
            setOrder(value);
          }}
          options={[ 'asc', 'desc' ]}
          value={order}
        />
      </div>
    </div>
  )
};

export default SortControls;