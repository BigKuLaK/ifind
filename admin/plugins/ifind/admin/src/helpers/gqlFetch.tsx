import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../providers/authProvider';

/**
 * TODO:
 * 
 * Use this in replacement of our custom useQuery implementation
 */
export const useGQLFetch = () => {
  const { jwt } = useAuth();

  const gqlFetch = useCallback((query, variables = {}) => (
    jwt
    ? window.fetch(`/graphql`, {
      method: 'post',
      headers: {
        authorization: `Bearer ${jwt}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: variables || {}
      })
    })
    .then(res => res.json())
    .then(({ data, errors }) => {
      if ( errors ) {
        throw new Error(errors[0]);
      }

      return data;
    })
    : Promise.resolve(null)
  ), [ jwt ])

  return gqlFetch;
}