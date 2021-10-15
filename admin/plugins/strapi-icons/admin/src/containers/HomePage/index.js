/*
 *
 * HomePage
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FAIcons from '@fortawesome/free-solid-svg-icons';
import { Text, Table, Row } from '@buffetjs/core';
import { Header } from '@buffetjs/custom';
import { InputText } from '@buffetjs/core';

import icons from '../../icons';
import './styles.css';

const FAIconsList = Object.entries(FAIcons).filter(([name, icon]) => icon.iconName).map(([ importName, icon ]) => ({
  ...icon,
  importName,
}));

const headers = [
  {
    name: 'Preview',
    value: 'preview',
  },
  {
    name: 'Import Name',
    value: 'importName',
  },
  {
    name: 'Class Name',
    value: 'className',
  },
];

const HomePage = () => {
  const [ filter, setFilter ] = useState();
  const [ icons, setIcons ] = useState(FAIconsList);

  useEffect(() => {
    if ( filter ) {
      const filterMatcher = new RegExp(filter, 'gi');
      const filteredIcons = FAIconsList.filter(({ iconName }) => filterMatcher.test(iconName));
      setIcons(filteredIcons);
    } else {
      setIcons(FAIconsList);
    }
  }, [ filter ]);

  return (
    <div className="container">
      <Header
        title={{ label: 'Strapi Icons' }}
        content="For admin UI use only"
      />

      <div className="icons-list-filter">
        <InputText
          name="input"
          onChange={({ target: { value } }) => {
            setFilter(value);
          }}
          placeholder="Filter Icons..."
          type="search"
          value={filter}
        />
      </div>
      
      <div className="icons-list">
        {
          icons.map((icon) => (
            <div className="icons-list__item">
              <FontAwesomeIcon icon={icon} size='md' />
              <Text className="icons-list__name" color="lightBlue">{icon.importName}</Text>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default memo(HomePage);
