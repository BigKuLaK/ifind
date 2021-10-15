import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RatingWarps from '../RatingWarps';

import './styles.scss';

const RATING_INCREMENTS = 0.5;

const RatingWarpsControl = ({ rating = 0, onChange, disabled = false }) => {
  const percentage = rating / 10 * 100;

  const onSubtract = useCallback((e) => {
    e.preventDefault();
    if ( typeof onChange === 'function' ) {
      onChange( rating - RATING_INCREMENTS );
    }
  }, [ rating, onChange ]);

  const onAdd = useCallback((e) => {
    e.preventDefault();
    if ( typeof onChange === 'function' ) {
      onChange( rating + RATING_INCREMENTS );
    }
  }, [ rating, onChange ]);

  return (
    <div className="rating-warps-control">
      <button
        className="rating-warps-control__control rating-warps-control__control--subtract"
        onClick={(e) => onSubtract(e)}
        disabled={rating <= 0 || disabled}
      ><FontAwesomeIcon icon='minus' /></button>
      <RatingWarps percentage={percentage} />
      <button
        className="rating-warps-control__control rating-warps-control__control--add"
        onClick={(e) => onAdd(e)}
        disabled={rating >= 10 || disabled}
      ><FontAwesomeIcon icon='plus' /></button>
    </div>
  )
}

export default RatingWarpsControl;