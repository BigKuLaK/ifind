/**
 * Generates a Promise that can be cancelled
 * Source: https://medium.com/@masnun/creating-cancellable-promises-33bf4b9da39c
 *
 * Usage: cancellablePromise(() => console.log('resolved')).cancel();
 */
module.exports = (bodyFunction) => {
  let cancelFn;

  const signal = new Promise((resolve, reject) => {
    cancelFn = () => reject("cancel");
  });

  const promise = new Promise((resolve, reject) => {
    bodyFunction(resolve, reject);

    signal.catch((err) => {
      reject(err);
    });
  });

  promise.catch(err => {
    if ( err !== 'cancel' ) {
      console.log('error');
      throw err;
    }
  });

  promise.cancel = cancelFn;

  return promise;
};
