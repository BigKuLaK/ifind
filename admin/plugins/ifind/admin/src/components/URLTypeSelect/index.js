import React, { useEffect, useState, useCallback } from 'react';
import { Select, Label } from '@buffetjs/core';
import { v4 as uuid } from 'uuid';

import { useSourceRegion } from '../../providers/sourceRegionProvider';

const URLTypeSelect = ({
  region = null,
  source = null,
  onChange,
  label = 'URL Type',
  name = 'url-type'
}) => {
  const { sources } = useSourceRegion();
  const [ id ] = useState(uuid());
  const [ urlType, setURLType ] = useState('');
  const [ urlTypeOptions, setUrlTypeOptions ] = useState([]);

  const onURLTypeSelect = useCallback(value => {
    if ( typeof onChange === 'function' ) {
      const matchedURLTypeOption = urlTypeOptions.find(({ label }) => label === value);
      onChange(matchedURLTypeOption || null);
    }
  }, [ onChange, urlTypeOptions ]);

  useEffect(() => {
    const urlTypeOptions = [''];

    if ( sources?.length ) {
      const sourceRegionOptions = sources.reduce((sources, source) => ([
        ...sources,
        ...(source.regions || []).map(region => ({
          source: source.id,
          region: region.id,
          label: `${source.name} ${region.name}`,
        }))
      ]), []);

      urlTypeOptions.push(...sourceRegionOptions);
    }

    setUrlTypeOptions(urlTypeOptions);
  }, [ sources ]);

  useEffect(() => {
    const matchedURLType = urlTypeOptions.find((option) => (
      source === option.source &&
      region === option.region
    ));

    setURLType(matchedURLType?.label || '');

  }, [ urlTypeOptions, source, region ]);

  return (
    <div className="url-type-select">
      <Label for={id}>{label}</Label>
      <Select
        id={id}
        name={name}
        value={urlType}
        options={urlTypeOptions.map((urlType) => (urlType && urlType.label) || '')}
        onChange={({ target: { value } }) => {
          onURLTypeSelect(value);
        }}
      />
    </div>
  )
};

export default URLTypeSelect;