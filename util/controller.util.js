const fs = require('fs');
const devLog = require('./debug.util');

exports.deleteUploadFromStorage = (path) => {
  // delete product from file storage
  fs.unlink(path.slice(1), (err) => {
    if (err) devLog('log', err);
  });
};
