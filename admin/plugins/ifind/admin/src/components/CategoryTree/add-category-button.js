import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { generatePluginLink } from '../../helpers/url';

export const addCategoryDetailURL = generatePluginLink('/categories/create');
export const addCategoryText = 'Add Category';

const AddCategoryButton = () => (
  <Link to={addCategoryDetailURL} className="btn btn-primary category-tree-add">
    <FontAwesomeIcon icon='plus' /> {addCategoryText}
  </Link>
);

export default AddCategoryButton;