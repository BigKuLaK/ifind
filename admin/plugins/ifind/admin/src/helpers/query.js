import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../providers/authProvider';

export const useQuery = (query, variables) => {
  const { jwt } = useAuth();

  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ data, setData ] = useState(null);

  const callQuery = useCallback(() => {
    if ( !query || !jwt ) {
      return Promise.resolve({ data: null });
    }

    return window.fetch(`/graphql`, {
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
    .then(({ data }) => setData(data))
    .catch(error => setError(error));
  }, [ jwt, query, variables ]);

  const refetch = useCallback(() => {
    callQuery();
  }, [ callQuery ]);

  useEffect(() => {
    callQuery();
  }, [ query ]);

  useEffect(() => {
    if ( data || error ) {
      setLoading(false);
    }

    if ( error ) {
      strapi.notification.toggle({
        type: 'warning',
        title: 'Fetch error',
        message: error.message,
      });
      console.error(error);
    }
  }, [ error, data ]);

  return {
    loading,
    error,
    data,
    refetch
  };

};

export const useMutation = () => {
  const { jwt } = useAuth();
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  const [ data, setData ] = useState(null);

  const callMutation = useCallback((query, variables) => {
    if ( jwt ) {
      return window.fetch(`/graphql`, {
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
          setError(errors[0]);
        }
        else {
          setData(data);
          setError(null);
        }
      })
      .catch(error => setError(error))
    }

    return Promise.resolve(null);
  }, [ jwt ]);

  useEffect(() => {
    if ( data || error ) {
      setLoading(false);
    }
  }, [ error, data ]);

  return [
    callMutation,
    {
      loading,
      error,
      data,
    }
  ];
}