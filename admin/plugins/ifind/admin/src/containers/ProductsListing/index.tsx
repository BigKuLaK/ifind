/*
 *
 * HomePage
 *
 */

import React, { useState, useEffect, memo } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import pluginId from '../../pluginId';

import { Header } from '@buffetjs/custom';

import { ProductsListProvider } from '../../providers/productsListProvider';
import ProductsList from '../../components/ProductsList';

import './styles.scss';

const ProductsListing = () => {
  const history = useHistory();

  return (
    <div className="container">
      <div className="row">
        <Header
          title={{ label: 'Products' }}
          actions={[
            {
              label: 'Add Product',
              onClick: () => history.push(`/plugins/${pluginId}/products/create`),
              color: 'primary',
              type: 'button',
              icon: 'plus'
            },
          ]}
        />
      </div>
      <ProductsList />
    </div>
  );
};

export default memo(() => (
  <ProductsListProvider>
    <ProductsListing />
  </ProductsListProvider>
));
