'use strict';
const request = require('request');
const config = require('../config.json');
const prefix = !!config.prefix ? `${config.prefix}.` : '';
const tags = Object.keys(config.tags || {}).map((k) => { return `,${k}=${config.tags[k]}`; }).join('');

var getUsername = (user) => {
  return typeof user.name === 'string'
    ? user.name
    : user.name.givenName + '\\ ' + user.name.familyName;
};

/*
{
  user: { name: 'anonymous' } or { name: { givenName: 'anony', familyName: 'mous' } },
  applicationName: 'my-app',
  featureName: 'my-feature',
  toggleName: 'my-toggle',
  value: false
}
*/
var formatForInflux = (payload) => {
  var metricName = `${prefix}hobknob.${payload.applicationName}.${payload.featureName}.${payload.toggleName || 'toggle'}`;
  return `${metricName},user=${getUsername(payload.user)}${tags} value=${payload.value} ${(new Date()).getTime()}`;
};

module.exports = {
  write: (payload, done) => {
    request({
      method: 'post',
      url: `http://${config.host}:${config.port}/write?db=${config.database}&precision=ms`,
      auth: {
        user: config.username,
        pass: config.password
      },
      body: formatForInflux(payload),
      headers: {
        'content-type': ''
      }
    }, (err, res, body) => {
      if(err){
        done(err);
      }

      if(res.statusCode >= 300){
        return new Error(`unexpected status code: ${res.statusCode} (body: ${body})`);
      }

      done();
    });
  }
};
