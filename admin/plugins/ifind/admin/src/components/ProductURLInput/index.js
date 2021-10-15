import React, { useEffect, useState, useCallback } from 'react';
import { Button, Text } from '@buffetjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 as uuid } from 'uuid';

import InputBlock from '../InputBlock';
import ProductURLInputItem from '../ProductURLInputItem';

import './styles.scss';

const ProductURLInput = ({
  label = '',
  urls = [],
  error = '',
  className = '',
  onChange,
}) => {
  const [ urlList, setUrlList ] = useState(urls.map((urlData) => ({
    ...urlData,
    softId: uuid(),
  })));

  const onAddURLClick = useCallback(() => {
    setUrlList([
      ...urlList,
      {
        region: '',
        source: '',
        url: '',
        price: 0,
        softId: uuid(),
      }
    ]);
  }, [ urlList ]);

  const onURLDataChange = useCallback(({ source, region, url, is_base, price, softId }) => {
    console.log({ url });
    const updatedList = urlList.map(urlData => (
      urlData.softId === softId ?
      { source, region, url, is_base, softId, price } :
      urlData
    ));

    setUrlList(updatedList);
  }, [ urlList ]);

  const onItemDelete = useCallback((softId) => {
    const newList = urlList.filter(item => item.softId !== softId);
    setUrlList([...newList]);
  }, [ urlList ]);

  useEffect(() => {
    if ( typeof onChange === 'function' ) {
      onChange(urlList);
    }
  }, [ urlList, onChange ])

  useEffect(() => {
    setUrlList(urls.map(urlData => ({
      ...urlData,
      softId: urlData.softId || uuid(),
    })));
  }, [ urls ]);

  return (
    <InputBlock className={[ 'product-url-input', className ].join(' ')} error={error}>
      {label ? <Text color="mediumBlue" fontWeight="bold">{label}</Text> : ''}
      <div className="product-url-input__list">
        {urlList.map((urlData) => (
          <ProductURLInputItem
            key={urlData.softId}
            {...urlData}
            onChange={onURLDataChange}
            onDelete={onItemDelete}
          />
        ))}
        <div className="product-url-input__control">
          <Button
            color="secondary"
            onClick={onAddURLClick}
            icon={<FontAwesomeIcon icon="plus" />}
          >
            Add URL
          </Button>
        </div>
      </div>
    </InputBlock>
  )
}

export default ProductURLInput;