import { ADMIN_API_ROOT } from '@config/adminApi'

/**
 * 
 * @param {String} relativeURL - the relative pathname
 * @returns {String}
 */
export const toAdminURL = (relativeURL = '') => (
    ADMIN_API_ROOT
        .split(/\//g)
        .slice(0, 3)
        .join('/') +
    relativeURL
        .replace(/^\/+/, '/')
)

export const addURLParams = (url = '', paramsObject) => {
    const [ baseURL, searchParams = '' ] = url.split('?');
    const searchParamsObject = searchParams.split('&').filter(Boolean).reduce((all, keyValue) => {
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