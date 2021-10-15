import React from 'react';

import Icon from '../IconItem';
import { iconsList } from 'ifind-icons';

import './styles.css';

const IconsList = () => {
  return (
    <div className="icons-list">
      {iconsList.map(icon => (
        <div className="icons-list__item">
          <Icon icon={icon} />
          <strong className="icons-list__name">{icon}</strong>
        </div>
      ))}
    </div>
  )
};

export default IconsList;