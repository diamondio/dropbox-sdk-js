var request = require('superagent');
var Promise = require('es6-promise').Promise;
var getBaseURL = require('./get-base-url');

var buildCustomError;
var downloadRequest;
var nodeBinaryParser;

// Register a handler that will instruct superagent how to parse the response
request.parse['application/octect-stream'] = function (obj) {
  return obj;
};

// This doesn't match what was spec'd in paper doc yet
buildCustomError = function (error, response) {
  return {
    status: error.status,
    error: (response ? response.text : null) || error.toString(),
    response: response
  };
};

nodeBinaryParser = function (res, done) {
  res.text = '';
  res.setEncoding('binary');
  res.on('data', function (chunk) { res.text += chunk; });
  res.on('end', function () {
    done();
  });
};

downloadRequest = function (path, args, auth, host, accessToken, selectUser) {
  if (auth !== 'user') {
    throw new Error('Unexpected auth type: ' + auth);
  }

  var apiRequest = request.post(getBaseURL(host) + path)
    .set('Authorization', 'Bearer ' + accessToken)
    .set('Dropbox-API-Arg', JSON.stringify(args))
    .on('request', function () {
      if (this.xhr) {
        this.xhr.responseType = 'blob';
      }
    });

  if (selectUser) {
    apiRequest = apiRequest.set('Dropbox-API-Select-User', selectUser);
  }

  return apiRequest;
};

module.exports = downloadRequest;
