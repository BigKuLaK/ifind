import React from 'react';

const IFINDIcon = ({ icon, className = '' }) => {
  return (
    <div className={[
      'ifind-icon',
      className
    ].join(' ')}>
      <div
        className="ifind-icon__image"
        style={{
          ["--icon-path"]: `url(/icons/${icon.replace(/_/g, '-')}.svg)`,
        }}
      />
    </div>
  )
};

export default IFINDIcon;