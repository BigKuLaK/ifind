import React from 'react';

const Icon = ({ icon }) => (
  <svg className="ifind-icon">
    <use xlinkHref={`#${icon}`} ></use>
  </svg>
);

export default Icon;