import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Label } from '@buffetjs/core';

import { useLanguages } from '../../providers/languageProvider';

import CustomSelect from '../CustomSelect';
import InputBlock from '../InputBlock';

const LanguageSelect = ({ label, value, onChange, className, filter }) => {
  const languages = useLanguages();
  const [ languageOptions, setLanguageOptions ] = useState([]);

  const classNames = [
    'language-select',
    className,
  ].filter(Boolean).join(' ');
  
  const onLanguageSelect = useCallback((selectedLanguage) => {
    if ( typeof onChange === 'function' ) {
      onChange(selectedLanguage);
    }
  }, [ onChange ]);

  useEffect(() => {
    const options = languages
      .filter(language => filter(language) || value === language.id)
      .map(({ name, id }) => ({
        label: name,
        value: id
      }));

    setLanguageOptions(options);
  }, [ languages, filter ]);

  return (
    <InputBlock className={classNames}>
      <Label className='language-select__label'>{label}</Label>
      <CustomSelect
        value={value}
        onChange={onLanguageSelect}
        options={languageOptions}
      />
    </InputBlock>
  )
};

LanguageSelect.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func,
  className: PropTypes.string,
  filter: PropTypes.func,
};

LanguageSelect.defaultProps = {
  label: 'Language',
  value: null,
  onChange: () => {},
  className: '',
  filter: () => true,
}

export default LanguageSelect;