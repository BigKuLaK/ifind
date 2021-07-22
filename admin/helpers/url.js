const AMAZON_TAG = 'ifind01-21';

const addURLParams = (url = '', paramsObject) => {
  const [ baseURL, searchParams = '' ] = url.split('?');
  const searchParamsObject = searchParams.split('&').reduce((all, keyValue) => {
    const [ key, value ] = keyValue.split('=');
    all[key] = value;
    return all;
  }, {});
  const newParams = {
    ...searchParamsObject,
    ...paramsObject,
  };
  const newParamsString = Object.entries(newParams).map(([ key, value ]) => `${key}=${value}`).join('&');

  return baseURL + '?' + newParamsString;
}

const removeURLParams = (url = '') => {
  const segments = url.split('/');
  const lastSegment = segments.pop();
  const [ nonSearchSegment ] = lastSegment.split('?');

  segments.push(nonSearchSegment);
  return segments.join('/');
}

const toSearchParams = (paramsObject = {}) => {
  const entries = Object.entries({
    ...paramsObject,
  });

  return (
    entries.length ?
    '?' + entries.map(entry => entry.join('=')).join('&') :
    ''
  )
}

const amazonLink = (originalLink = '') => {
  const [ baseURL, searchParamsString = '' ] = originalLink.split('?');

  const searchParamsObj = searchParamsString.split('&').reduce((obj, param) => {
    const [ key, value ] = param.split('=');

    if ( key && value ) {
      obj[key] = value;
    }

    return obj;
  }, {});

  return baseURL + toSearchParams({
    ...searchParamsObj,
    tag: AMAZON_TAG
  });
}

module.exports = {
  addURLParams,
  removeURLParams,
  amazonLink,
};
