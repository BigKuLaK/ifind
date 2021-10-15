import React from 'react';
import { Text } from '@buffetjs/core';

import './styles.scss';

const Panel = ({ title = '', children, className = '' }) => {
  return (
    <div className={['panel', className].join(' ')}>
      { title ? <h2 className="panel__heading col-xs-12">{title}</h2> : '' }
      <div className="panel__content">
        {children}
      </div>
    </div>
  )
};

export default Panel;