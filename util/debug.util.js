/* eslint-disable no-console */
const devLog = (...params) => {
  let next;
  const [type, ...rest] = params;

  if (type === 'error') {
    next = rest.pop();
  }

  console[type](...rest);

  if (type !== 'error') return () => {};

  const error = rest[0] instanceof Error ? rest[0] : new Error(rest[0]);
  error.httpStatusCode = 500;
  return next(error);
};

module.exports = devLog;
