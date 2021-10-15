import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useProduct } from '../../providers/productProvider';
import JSONPreview from '../JSONPreview';
import './styles.scss';

const ProductChangeHistoryTable = ({ className }) => {
  const [ productData ] = useProduct();
  const [ productChanges, setProductChanges ] = useState([]);

  useEffect(() => {
    if ( productData && productData.product_changes ) {
      const changes = [...productData.product_changes];

      // Sort by datetime in DESC order
      changes.sort((changesA, changesB) => (
        changesA.date_time > changesB.date_time ? -1 : 1
      ));

      setProductChanges(changes);
    }
    else {
      setProductChanges([]);
    }
  }, [ productData ]);

  const classNames = [
    'product-change-history-table',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <table className="product-change-history-table__table">
        <thead>
          <tr>
            <th>Datetime (UTC)</th>
            <th>Admin User</th>
            <th>Change Type</th>
            <th>Changes Applied</th>
          </tr>
        </thead>
        <tbody>
          {productChanges.map(productChange => {
            const dateTime = moment.utc(productChange.date_time);
            return (
              <tr key={productChange.date_time}>
              <td>
                <strong>{dateTime.format('YYYY-MM-DD')}</strong>&nbsp;
                <em>{dateTime.format('HH:MM:SS a')}</em>
              </td>
              <td>{productChange.admin_user ? `${productChange.admin_user.firstname} ${productChange.admin_user.lastname}` : ''}</td>
              <td>{productChange.change_type}</td>
              <td>
                {productChange.state ? <JSONPreview data={productChange.state} className='product-change-history-table__state' /> : ''}
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductChangeHistoryTable;