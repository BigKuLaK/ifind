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

module.exports = {
  addURLParams,
  removeURLParams,
};
