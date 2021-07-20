import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Label } from '@buffetjs/core';

import NumberInput from '../NumberInput';

// number
// date_time

const AttributeMinMaxInput = ({ value, type, onChange }) => {
  if ( type === 'number' ) {
    return (
      <NumberInput
        value={value}
        onChange={onChange}
      />
    )
  }
  else {
    return null;
  }
};

export default AttributeMinMaxInput;