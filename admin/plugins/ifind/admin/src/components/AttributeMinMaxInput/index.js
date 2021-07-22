import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Label } from '@buffetjs/core';

import NumberInput from '../NumberInput';

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
    return null;
  }
};

export default AttributeMinMaxInput;