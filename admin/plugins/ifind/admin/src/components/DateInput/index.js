import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Label } from '@buffetjs/core';
import { v4 as uuid } from 'uuid';

import InputBlock from '../InputBlock';

const DateInput = ({ name, value, label, onChange, className }) => {
  const [ nameAttribute ] = useState(name ? name : `date-picker-${uuid()}`);

  const classNames = [
    'date-input',
    className,
  ].filter(Boolean).join(' ');

  const onDateChange = useCallback((momentDate) => {
    if ( typeof onChange === 'function' && momentDate ) {
      onChange(momentDate.toISOString());
    }
  }, [ onChange ]);

  return (
    <InputBlock className={classNames}>
      <Label className='date-input__label'>
        <span dangerouslySetInnerHTML={{ __html: label || '&nbsp;' }} />
      </Label>
      <DatePicker
        name={nameAttribute}
        value={value}
        onChange={({ target }) => onDateChange(target.value)}
        className='date-input__date-picker'
      />
    </InputBlock>
  )
};

DateInput.PropTypes = {
  name: PropTypes.string,
  value: PropTypes.string, // ISO DateTime
  label: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default DateInput;