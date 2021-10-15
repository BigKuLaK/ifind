/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import { spriteContents } from 'ifind-icons';
import { Header } from '@buffetjs/custom';

import IconsList from '../../components/IconsList';

const HomePage = () => {
  return (
    <div className="container">

      <div hidden dangerouslySetInnerHTML={{ __html: spriteContents }}></div>

      <Header
        title={{ label: 'IFIND Icons' }}
        content="For usage and styling, refer to IFIND Storybook"
      />

      <IconsList />
    </div>
  );
};

export default memo(HomePage);
