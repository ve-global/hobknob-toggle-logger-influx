'use strict';
const request = require('request');
const config = require('../config.json');
const tags = Object.keys(config.tags || {}).map((k) => { return `${k}=${config.tags[k]}`; });

/*
{
  user: { name: 'anonymous' },
  applicationName: 'my-app',
  featureName: 'my-feature',
  toggleName: 'my-toggle',
  value: false
}
*/
var formatForInflux = (payload) => {
  var user = payload.user.name;
  var metricName = `hobknob.${payload.applicationName}.${payload.featureName}.${payload.toggleName || 'toggle'}`;
  return `${metricName},user=${user},${tags} value=${payload.value} ${(new Date()).getTime()}`;
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
