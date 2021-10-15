import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Label } from '@buffetjs/core';

import TextInput from '../TextInput';
import LanguageSelect from '../LanguageSelect';
import InputBlock from '../InputBlock';
import FontAwesomeIcon from '../FontAwesomeIcon';
import { useTranslatedInput } from './provider';

const Item = ({ itemKey, language, label, onChange, deleteItem }) => {
  const { availableLanguages } = useTranslatedInput();

  const onLabelChange = useCallback((value) => {
    if ( typeof onChange === 'function' ) {
      onChange({
        key: itemKey,
        language,
        label: value,
      });
    }
  }, [ language, itemKey, onChange ]);
  
  const onLanguageChange = useCallback(({ value }) => {
    if ( typeof onChange === 'function' ) {
      onChange({
        key: itemKey,
        language: value,
        label,
      });
    }
  }, [ label, itemKey, onChange ]);

  const languageFilter = useCallback(({ id }) => (
    availableLanguages.includes(id)
  ), [ availableLanguages ]);

  const onDeleteClick = useCallback(() => {
    if ( typeof deleteItem === 'function' ) {
      deleteItem(itemKey);
    }
  }, [ itemKey, deleteItem ]);

  return (
    <div className="translated-labels-input__item">
      <LanguageSelect
        value={language}
        className='translated-labels-input__language'
        onChange={onLanguageChange}
        filter={languageFilter}
      />
      <TextInput
        value={label}
        onChange={onLabelChange}
        label='Label'
        className='translated-labels-input__label'
      />
      <InputBlock>
        <Label>&nbsp;</Label>
        <Button
          onClick={onDeleteClick}
          color='delete'
          icon={<FontAwesomeIcon icon='trash' />}
        />
      </InputBlock>
    </div>
  );
};

Item.propTypes = {
  itemKey: PropTypes.string,
  language: PropTypes.number,
  label: PropTypes.string,
  onChange: PropTypes.func,
  deleteItem: PropTypes.func,
};

Item.defaultProps = {
  onChange: () => {},
  deleteItem: () => {},
};

export default Item;