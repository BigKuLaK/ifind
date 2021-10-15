const { combineReducers } = require('redux');
const { configureStore } = require('@reduxjs/toolkit');

// Reducers
const { reducers: productChange, actions: productChangeActions } = require('./product-change');

const store =  configureStore({
  reducer: combineReducers({
    productChange,
  }),
  // https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        // ignoredActions: ['your/action/type'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.state', 'productChange.productChangeParams'],
        // Ignore these paths in the state
        ignoredPaths: ['payload.state', 'productChange.productChangeParams'],
      },
    }),
});

const createDispatchers = ( reducersMap ) => (
  Object.entries(reducersMap).reduce((dispatchers, [ dispatcherName, dispatcherFunction ]) => {
    dispatchers[dispatcherName] = (payload) => store.dispatch(dispatcherFunction(payload));
    return dispatchers;
  }, {})
);

// Each "reducer" from the slice definitions will be exposed as dispatcher functions
module.exports = {
  ...createDispatchers(productChangeActions),
  getState: () => store.getState()
};
