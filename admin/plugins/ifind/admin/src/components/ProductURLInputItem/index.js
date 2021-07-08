import React, { useEffect, useState, useCallback } from 'react';
import { InputText, InputNumber, Label, Button } from '@buffetjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@buffetjs/styles';
import { v4 as uuid } from 'uuid';

import { amazonLink } from '../../helpers/url';
import { useSourceRegion } from '../../providers/sourceRegionProvider';
import InputBlock from '../InputBlock';
import URLTypeSelect from '../URLTypeSelect';

const ProductURLInputItem = ({ source, region, url, price, onChange, onDelete, softId }) => {
  const { sources } = useSourceRegion();
  const [ regionInput, setRegionInput ] = useState(region);
  const [ sourceInput, setSourceInput ] = useState(source);
  const [ urlInput, setUrlInput ] = useState(url);
  const [ priceInput, setPriceInput ] = useState(price);
  const [ sourceName, setSourceName ] = useState('');
  const [ fieldID ] = useState(uuid());

  const onURLTypeSelect = useCallback(({ source, region }) => {
    setRegionInput(region);
    setSourceInput(source);
  });

  const onURLInput = useCallback((urlValue) => {
    setUrlInput(urlValue);
  });

  const onPriceInput = useCallback((urlValue) => {
    setPriceInput(urlValue);
  });

  const onDeleteClick = useCallback(() => {
    if ( typeof onDelete == 'function' ) {
      onDelete(softId);
    }
  }, [onDelete, softId]);

  const generateLink = useCallback(() => {
    const matchedSource = sources.find(({ id }) => id === source);

    if ( matchedSource ) {
      switch (matchedSource.name.toLowerCase()) {
        case 'amazon':
          setUrlInput(amazonLink(urlInput));
        // Todo: Add Ebay Link Generation
        // Todo: Add Alibaba Link Generation
        // Todo: Add Idealo Link Generation
        default:;
      }
    }
  }, [ urlInput, sourceInput, sources ]);

  useEffect(() => {
    if ( typeof onChange === 'function' ) {
      onChange({
        url: urlInput,
        source: sourceInput,
        region: regionInput,
        price: priceInput,
        softId,
      });
    }
  }, [ regionInput, sourceInput, urlInput, priceInput ]);

  useEffect(() => {
    const matchedSource = sources.find(({ id }) => id === sourceInput);

    if ( matchedSource ) {
      setSourceName(matchedSource.name);
    }
  }, [ sourceInput ]);

  return (
    <div className="product-url-input__item row">
      <InputBlock className="col-md-2">
        <URLTypeSelect
          label="URL Type"
          onChange={onURLTypeSelect}
          region={regionInput}
          source={sourceInput}
        />
      </InputBlock>
      <InputBlock className="col-md-3">
        <Label>Price</Label>
        <InputNumber
          onChange={({ target: { value }}) => onPriceInput(value)}
          value={priceInput}
        />
      </InputBlock>
      <InputBlock className="col-md-5">
        <Label>URL</Label>
        <InputText
          onChange={({ target: { value }}) => onURLInput(value)}
          value={urlInput}
        />
      </InputBlock>
      <InputBlock className="col-md-2">
        <Label>&nbsp;</Label>
        <div className="product-url-input__item-controls">
          <Button
            data-for={`tooltip-${fieldID}`}
            data-tip={`Generate ${sourceName} link`}
            className="product-url-input__item-link"
            color="secondary"
            icon={<FontAwesomeIcon icon="link" />}
            onClick={generateLink}
          >
            <Tooltip id={`tooltip-${fieldID}`} />
          </Button>
          <Button
            className="product-url-input__item-delete"
            color="cancel"
            icon={<FontAwesomeIcon icon="trash-alt" />}
            onClick={onDeleteClick}
          ></Button>
        </div>
      </InputBlock>
    </div>
  )
};

export default ProductURLInputItem;