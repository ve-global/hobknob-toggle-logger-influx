'use strict';

const influx = require('./lib/influx');

module.exports = {
  /*
  {
    user: { name: 'anonymous' },
    applicationName: 'my-app',
    featureName: 'my-feature',
    toggleName: 'my-toggle',
    value: false
  }
  */
  updateFeatureToggle: function(updateEvent, next) {
    influx.write(updateEvent, next);
  }
};
