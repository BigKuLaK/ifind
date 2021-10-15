import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobal } from '../../providers/globalProvider';

import './styles.scss';

const LoadingOverlay = () => {
  const { isLoading } = useGlobal();

  return isLoading
  ? (
    <div className="loading-overlay">
      <FontAwesomeIcon icon="spinner" size='lg' pulse />
    </div>
  )
  : null
}

export default LoadingOverlay;