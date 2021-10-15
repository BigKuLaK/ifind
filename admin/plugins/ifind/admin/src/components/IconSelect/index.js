import React, { useState, useEffect, useCallback } from 'react';
import { iconsList } from 'ifind-icons';
import { Label } from '@buffetjs/core';

import IFINDIcon from '../IFINDIcon';
import InputBlock from '../InputBlock';
import CustomSelect from '../CustomSelect';

import './styles.scss';

const IconSelect = ({ label = 'Icon', value, onChange, id = '' , name = '', className = '' }) => {
  const [ iconOptions, setIconOptions ] = useState([]);
  const classNames = [
    'icon-select',
    className,
  ].filter(Boolean).join(' ');

  const onIconSelect = useCallback(({ value }) => {
    if ( typeof onChange === 'function' ) {
      onChange(value);
    }
  });

  useEffect(() => {
    setIconOptions(iconsList.map(icon => ({
      value: icon,
      label: (
        <div className="icon-select__option">
          <IFINDIcon icon={icon} />{icon}
        </div>
      )
    })))
  }, [ iconsList ]);

  return (
    <InputBlock className={classNames}>
      <Label htmlFor={id}>{label}</Label>
      <CustomSelect
        id={id}
        name={name}
        value={value}
        options={iconOptions}
        withSearch={true}
        onChange={onIconSelect}
      />
    </InputBlock>
  );
}

export default IconSelect;