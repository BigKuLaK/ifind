import React, { useState, useEffect, useCallback } from 'react';
import { useSourceRegion } from '../../providers/sourceRegionProvider';
import InputBlock from '../InputBlock';
import { Select, Label } from '@buffetjs/core';

const RegionSelect = ({ label = 'Region', onChange, value, disabled, id = 'region-select', error = false, className }) => {
  const { regions } = useSourceRegion();

  const getRegionOptions = useCallback(() => (
    regions.map(region => ({
      label: `${region.name} (${region.code})`,
      id: region.id,
      code: region.code,
    }))
  ), [ regions ]);

  const [ regionOptions, setRegionOptions ] = useState(getRegionOptions());
  const [ selectedRegion, setSelectedRegion ] = useState((
    regionOptions.find(({ code }) => /de/i.test(code))
  ));

  const onRegionSelect = useCallback((value) => {
    const matchedRegion = regionOptions.find(({ label }) => label === value);

    if ( matchedRegion && typeof onChange === 'function' ) {
      onChange(matchedRegion.id);
    }
  }, [ onChange, regionOptions ]);

  useEffect(() => {
    setRegionOptions(getRegionOptions());
  }, [ regions ]);

  useEffect(() => {
    const matchedRegion = regionOptions.find(({ id }) => id === value) || 
                          regionOptions.find(({ code }) => /de/.test(code));
    setSelectedRegion(matchedRegion);
  }, [ value, regionOptions ]);
  
  return (
    <InputBlock
      className={['region-select'].concat(className).join(' ')}
      error={error}
    >
      <Label htmlFor={id}>{label}</Label>
      <Select
        name={id}
        id={id}
        onChange={({ target: { value } }) => {
          onRegionSelect(value);
        }}
        options={regionOptions.map(({ label }) => label)}
        value={selectedRegion?.label}
        disabled={disabled}
      />
    </InputBlock>
  )
}

export default RegionSelect;