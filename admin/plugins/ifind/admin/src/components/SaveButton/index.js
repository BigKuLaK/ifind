import React, { useCallback } from 'react';
import { Button } from '@buffetjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SaveButton = ({ save, loading }) => {
  const saveFn = useCallback((e) => {
    e.preventDefault();

    if ( !loading ) {
      save();
    }
  }, [ save, loading ]);

  return (
    <Button
      color={loading ? 'cancel' : 'secondary'}
      icon={<FontAwesomeIcon icon={ loading? 'spinner' : 'save'} pulse={loading}/>}
      onClick={saveFn}
      label={loading ? 'Saving' : 'Save Changes'}
    />
  );
};

export default SaveButton;