import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Label, Button } from '@buffetjs/core';

import FontAwesomeIcon from '../FontAwesomeIcon';

import { useTranslatedInput, TranslatedLabelsInputProvider } from './provider';
import Item from './item';

import './styles.scss';

const TranslatedLabelsInput = ({ label, labels, onChange, className }) => {
  const { availableLanguages, setUsedLanguages } = useTranslatedInput();
  const [ labelInputs, setLabelInputs ] = useState([]);

  const onItemChange = useCallback((itemData) => {
    if ( typeof onChange === 'function' ) {
      const newLabelsData = labelInputs.map(labelInput => {
        if ( labelInput.key === itemData.key ) {
          return {
            ...labelInput,
            ...itemData,
          }
        }
        return labelInput;
      });

      onChange(newLabelsData);
    }
  }, [ labelInputs ]);

  const onAddClick = useCallback(() => {
    if ( typeof onChange === 'function' ) {
      const newLabels = [
        ...labelInputs,
        {
          language: null,
          label: '',
        }
      ];

      onChange(newLabels);
    }
  }, [ labelInputs, onChange ]);

  const deleteItem = useCallback(itemKey => {
    if ( typeof onChange === 'function' ) {
      const filteredLabelInputs = labelInputs.filter(({ key }) => key !== itemKey);
      onChange(filteredLabelInputs);
    }
  }, [ labels, labelInputs, onChange ])

  useEffect(() => {
    setLabelInputs(labels.map(label => ({
      ...label,
      key: label.key || uuid(),
    })));

    const usedLanguages = labels
      .filter(label => label.language)
      .map(({ language }) => language);

    setUsedLanguages(usedLanguages);
  }, [labels]);

  const classNames = [
    'translated-labels-input',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <Label className='translated-labels-input__label'>{label}</Label>
      {
        labelInputs.map(labelInput => (
          <Item
            {...labelInput}
            itemKey={labelInput.key}
            onChange={onItemChange}
            deleteItem={deleteItem}
          />
        ))
      }
      {
        availableLanguages.length ?
        <Button
          className='translated-labels-input__add'
          label='Add Label'
          icon={<FontAwesomeIcon icon='plus' />}
          onClick={onAddClick} />
        : null
      }
    </div>
  );
};

TranslatedLabelsInput.propTypes = {
  label: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.shape({
    language: PropTypes.number,
    label: PropTypes.string,
  })),
  onChange: PropTypes.func,
  className: PropTypes.string,
};

TranslatedLabelsInput.defaultProps = {
  label: 'Translated Labels',
  labels: [],
  onChange: () => {},
};

export default (props) => (
  <TranslatedLabelsInputProvider>
    <TranslatedLabelsInput {...props} />
  </TranslatedLabelsInputProvider>
);