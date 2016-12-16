var request = require('request');
var getBaseURL = require('./get-base-url');

var downloadRequest = function (path, args, auth, host, accessToken, selectUser) {
  if (auth !== 'user') {
    throw new Error('Unexpected auth type: ' + auth);
  }

  var apiRequest = request.post(getBaseURL(host) + path, {
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Dropbox-API-Arg': JSON.stringify(args),
    }
  })

  if (selectUser) {
    apiRequest = apiRequest.set('Dropbox-API-Select-User', selectUser);
  }

  return apiRequest;
};

module.exports = downloadRequest;
