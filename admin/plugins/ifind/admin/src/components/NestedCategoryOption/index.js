import React, { useState, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { Label, Select, Text } from '@buffetjs/core';
import InputBlock from '../InputBlock';
import CustomSelect from '../CustomSelect';
import IFINDIcon from '../IFINDIcon';

import './styles.scss';

/*

  Logic steps
  - Plot options for categories
  - on categories set, check for categoryPath
    - if there's an entry in categoryPath,
      - select category
      - check for children
        - if has children, set children
        - else, call onChange
    - else, clear selection and call onChange
  - on select, call onChange

*/

/**
 * 
 * @param {bool} param0 props.allowParent - Whether to allow non-grandhildren category
 */
const NestedCategoryOption = ({ categories, categoryPath = [], onChange = null, level = 1, hasError = false, allowParent }) => {
  const [ id ] = useState(Math.random() * 1000);
  const [ categoryOptions, setCategoryOptions ] = useState([]);
  const [ selectedCategory, setSelectedCategory ] = useState(null);
  const [ children, setChildren  ] = useState(null); // Array of categories data

  const categoryLabel = useCallback((categoryData) => (
    `[${categoryData.id}] ${categoryData.label}`
  ), []);

  // setFinalSelectedCategory
  const onCategorySelect = useCallback(categoryID => {
    if ( typeof onChange === 'function' ) {
      onChange(categoryID);
    }
  }, [ onChange ]);

  useEffect(() => {
    const [ _currentCategory ] = categoryPath;

    // Set current category
    setSelectedCategory(_currentCategory);

    // Set children
    const matchedCategory = categories.find(({ id }) => _currentCategory === id);

    // Check for children
    if ( matchedCategory?.children ) {
      setChildren(Object.values(matchedCategory.children));
    }
    else {
      setChildren(null);
    }
  }, [ categoryPath, categories ]);

  useEffect(() => {
    const processedCategories = categories.map(category => {
      return {
        value: category.id,
        label: (
          <div className="nested-category-option__option">
            <IFINDIcon icon={category.icon.replace('_','-')} />
            {categoryLabel(category)}
          </div>
        ),
      }
    });

    setCategoryOptions([
      ...processedCategories
    ]);
  }, [ categories ]);


  return (
    <>
      <InputBlock className={[ 'col-md-12', hasError ? 'input-block--error': '' ].join(' ')}>
        <Label htmlFor="category">{level > 1 ? 'Subcategory' : 'Category'}</Label>
        {
          <CustomSelect
            name="category"
            id="category"
            value={selectedCategory}
            options={categoryOptions}
            onChange={(option) => onCategorySelect(option.value)}
          />
        }
      </InputBlock>
      {
        (children && selectedCategory && (
          <NestedCategoryOption
            categories={children}
            onChange={onChange}
            level={++level}
            categoryPath={categoryPath.slice(1)}
            hasError={hasError}
            allowParent={allowParent}
            />
        ))
      }
    </>
  )
};

NestedCategoryOption.propTypes = {
  categories: PropTypes.array, // Category objects
  categoryPath: PropTypes.arrayOf(PropTypes.number), // Category IDs
  onChange: PropTypes.func,
  level: PropTypes.number,
  hasError: PropTypes.bool,
  allowParent: PropTypes.bool,
};

NestedCategoryOption.defaultProps = {
  categories: [],
  categoryPath: [],
  onChange: () => {},
  level: 1,
  hasError: false,
  allowParent: false,
};

export default NestedCategoryOption;