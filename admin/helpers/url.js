// AMAZON AFFILIATE
const AMAZON_AFFILIATE_PARAMS = {
  tag: 'ifind01-21',
};

// EBAY AFFILIATE
// https://www.ebay.de/itm/223840934857?mkcid=1&mkrid=707-53477-19255-0&siteid=77&campid=5338787715&customid=&toolid=10001&mkevt=1
const EBAY_AFFILIATE_PARAMS = {
  campid: '5338787715',
  mkevt: 1,
  mkcid: 1,
  toolid: 10001,
};

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

const paramsToObject = (paramsString = '') => {
  const searchParamsObj = paramsString.split('&').reduce((obj, param) => {
    const [ key, value ] = param.split('=');

    if ( key && value ) {
      obj[key] = value;
    }

    return obj;
  }, {});

  return searchParamsObj;
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
    ...AMAZON_AFFILIATE_PARAMS
  });
}

const ebayLink = (originalLink = '') => {
  // Remove unnecessary params
  const [ baseURL, queryParams ] = originalLink.split('?');
  const queryParamsObj = paramsToObject(queryParams);

  return baseURL + toSearchParams({
    ...queryParamsObj,
    ...EBAY_AFFILIATE_PARAMS,
  });
}

module.exports = {
  addURLParams,
  removeURLParams,
  amazonLink,
  ebayLink,
};
