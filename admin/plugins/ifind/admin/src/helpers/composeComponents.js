import React from 'react'

export const composeComponents = (...components) => {
  components.reverse();

  return ({ children }) => (
    components.reduce((all, ParentComponent) => (
      <ParentComponent>
        {all}
      </ParentComponent>
    ), children)
  );
};