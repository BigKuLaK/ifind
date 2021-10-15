import React from 'react';

const IFINDIcon = ({ icon, className = '' }) => {
  return (
    <svg className={[
      'ifind-icon',
      className
    ].join(' ')}>
      <use xlinkHref={`#${icon.replace('_', '-')}`} />
    </svg>
  )
};

export default IFINDIcon;