import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useCategoriesListing, mapCategoriesTree, buildCategoryPath as _buildCategoryPath } from '../../providers/categoriesListingProvider';

import NestedCategoryOption from '../NestedCategoryOption';

import './styles.scss';

const CategorySelect = ({ exclude, category, onChange, hasError, emptyMessage, allowParent }) => {
  const { categories } = useCategoriesListing();

  // Nested category data
  const [ categoryPath, setCategoryPath ] = useState([]);
  const [ categoryOptions, setCategoryOptions ] = useState([]); // source-region-filtered categories

  const buildCategoryPath = useCallback(() => {
    // Build category path
    const _categoryPath = _buildCategoryPath(category, categories);
    // Use only id's for path
    setCategoryPath(_categoryPath.map(({ id }) => id));
  }, [ category, categories ]);

  const onNestedCategoryOptionChange = useCallback(lastCategory => {
    // LOGIC on category select:
    // Get matched category data
    // Check if has children
    // If has children
    // -- If allowParent, call onChange
    // Else, call onChange

    const matchedCategory = categories.find(({ id }) => id === lastCategory);

    if ( !matchedCategory || typeof onChange !== 'function' ) {
      return;
    }

    if ( matchedCategory.children?.length ) {
      // Fire onChange passing allowParent,
      // But only if allowParent
      // Otherwise, fire null
      if ( allowParent ) {
        onChange(matchedCategory.id, categoryPath);
      }
    }
    // Always fire onChange granchild category
    else {
      onChange(matchedCategory.id, categoryPath);
    }
  }, [ categories, onChange, categoryPath ]);

  // Set category options for UI only, no data manipulation
  useEffect(() => {
    const categoryTree = mapCategoriesTree(categories);
    const filteredOptions = Object.values(categoryTree).filter(category => (
      !exclude.includes(category.id)
    ));

    setCategoryOptions(filteredOptions);
    buildCategoryPath();
  }, [ categories ]);

  // Build categoryPath for rendering nested categories
  useEffect(() => {
    if ( category ) {
      buildCategoryPath();
    }
    else {
      setCategoryPath([]);
    }
  }, [ category ]);

  return (
    <div className="category-select">
      <NestedCategoryOption
          categories={categoryOptions}
          categoryPath={categoryPath}
          onChange={onNestedCategoryOptionChange}
          hasError={hasError}
          // allowParent={allowParent}
        />
      {/* {
        ( categoryPath.length <= 1 && categoryOptions.length < 1 ) ?
        <Text color="orange" className="col-md-12">Please select URL Type</Text> : 
        null
      } */}
    </div>
  )
};

CategorySelect.propTypes = {
  exclude: PropTypes.arrayOf(PropTypes.number),
  category: PropTypes.number,
  onChange: PropTypes.func,
  hasError: PropTypes.bool,
  allowParent: PropTypes.bool,
  emptyMessage: PropTypes.string,
};

CategorySelect.defaultProps = {
  exclude: [],
  onChange: () => {},
  hasError: false,
  allowParent: false,
  emptyMessage: 'No category options available',
};

export default CategorySelect;