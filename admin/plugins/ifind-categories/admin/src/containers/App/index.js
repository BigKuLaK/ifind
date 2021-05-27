/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from 'strapi-helper-plugin';
// Utils
import pluginId from '../../pluginId';
// Containers
import HomePage from '../HomePage';
// Providers
import Providers from '../../providers';

import { spriteContents } from 'ifind-icons';

const App = () => {
  return <>
    <div hidden dangerouslySetInnerHTML={{ __html: spriteContents }}></div>

    <Providers>
      <Switch>
        <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
        <Route component={NotFound} />
      </Switch>
    </Providers>
  </>
};

export default App;