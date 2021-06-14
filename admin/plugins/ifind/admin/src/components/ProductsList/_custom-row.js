import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { generatePluginLink } from '../../helpers/url';

const CustomRow = ({ row: {id, title, image, category, url, created_at, updated_at, selected = false, confirmProductDelete }, onSelect }) => {
  return (
    <tr>
      <td>
        <input
          className="products-list__product-checkbox"
          type="checkbox"
          checked={selected}
          onChange={({ target }) => onSelect(id, !selected)}
        />
      </td>
      <td>
        <Link to={generatePluginLink(`products/${id}`)}>{id}</Link>
      </td>
      <td>
        <Link to={generatePluginLink(`products/${id}`)}>{image}</Link>
      </td>
      <td>
        <Link to={generatePluginLink(`products/${id}`)}>{title}</Link>
      </td>
      <td>
        <Link to={generatePluginLink(`products/${id}`)}>{category}</Link>
      </td>
      <td>
        <Link to={generatePluginLink(`products/${id}`)}>{created_at.slice(0, 10)}</Link>
      </td>
      <td>
        <Link to={generatePluginLink(`products/${id}`)}>{updated_at.slice(0, 10)}</Link>
      </td>
      <td>
        <div className="products-list__product-actions">
          {
            url && (
              <a href={url} className="products-list__product-action" target="_blank">
                <FontAwesomeIcon icon='external-link-alt' color="gray" />
              </a>
            )
          }
          <button className="products-list__product-action" onClick={confirmProductDelete}>
            <FontAwesomeIcon icon='trash-alt' color="orange" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CustomRow;