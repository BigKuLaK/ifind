import { useCallback, useState, useEffect } from 'react';
import pluginId from '../pluginId';
import { useLocation } from 'react-router-dom';

type T_IndexSignature = {[key: string]: any};

const TAG = 'ifind01-21';

export const mapSearchParam = () => (
  window.location.search
    .slice(1)
    .split('&')
    .filter(Boolean)
    .map(keyValue => keyValue.split('='))
    .reduce((all, [ key, value ]) => ({
      ...all,
      [key]: value
    }), {})
);

export const getSearchParams = () => {
  return mapSearchParam();
}

export const useSearchParams = (): {[key: string]: any} => {
  const { search } = useLocation();
  const [ searchParams, setSearchParams ] = useState(getSearchParams());

  useEffect(() => {
    setSearchParams(getSearchParams());
  }, [ search ]);

  return searchParams;
};

const toSearchParams = (paramsObject = {}) => {
  const searchParams = getSearchParams();
  const entries = Object.entries({
    ...searchParams,
    ...paramsObject,
  });

  return (
    entries.length ?
    '?' + entries.map(entry => entry.join('=')).join('&') :
    ''
  )
}

export const generatePluginLink = (relativeToPlugin: string|null = null, _searchParams: T_IndexSignature|null = null, withParentRoute = false) => {
  const adminRoot = withParentRoute ? '/admin' : '';
  const searchParams = _searchParams ? toSearchParams(_searchParams) : '';

  if ( !relativeToPlugin ) {
    return window.location.pathname.replace(/^\/admin/, adminRoot) + searchParams;
  }

  const link = `${adminRoot}/plugins/${pluginId}/${relativeToPlugin.replace(/^\//,'')}${searchParams}`;
  return link;
};

export const amazonLink = (originalLink = '') => {
  const [ baseURL, searchParamsString ] = originalLink.split('?');

  const searchParamsObj = searchParamsString.split('&').reduce((obj: T_IndexSignature, param) => {
    const [ key, value ] = param.split('=');

    if ( key && value ) {
      obj[key] = value;
    }

    return obj;
  }, {});

  return baseURL + toSearchParams({
    ...searchParamsObj,
    tag: TAG
  });
}