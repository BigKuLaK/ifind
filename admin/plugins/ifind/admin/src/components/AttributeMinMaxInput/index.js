import React, { useEffect, useState, useCallback } from 'react';

import NumberInput from '../NumberInput';
import DateInput from '../DateInput';

import './styles.scss';

const AttributeMinMaxInput = ({ label, value, type, onChange }) => {
  if ( type === 'number' ) {
    return (
      <NumberInput
        label={label}
        value={value}
        onChange={onChange}
        className='attribute-min-max-input'
      />
    )
  }
  else {
    return (
      <DateInput
        label={label}
        value={value}
        onChange={onChange}
        className='attribute-min-max-input'
      />
    )
  }
};

export default AttributeMinMaxInput;