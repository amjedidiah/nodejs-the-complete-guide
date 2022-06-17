/* eslint-disable no-console */
const devLog = (...params) => {
  const [type, ...rest] = params;
  console[type](...rest);
};

module.exports = devLog;
