'use strict';
var proxyquire = require('proxyquire').noCallThru();
var should = require('should');
var clone = require('lodash.clone');

describe('write', () => {
  var calls = [];
  var baseConfig = {
    host: '127.0.0.1',
    port: 8086,
    database: 'my_database',
    username: 'user',
    password: 'password',
    tags: {
      env: 'test'
    }
  };
  var config = clone(baseConfig);

  beforeEach(() => {
    calls = [];
    config = clone(baseConfig);
  });

  var exec = (payload, done) => {
    var client = proxyquire('../lib/influx', {
      request: (options, cb) => {
        calls.push(options);
        cb(null, { statusCode: 204 });
      },
      '../config.json': config
    });

    client.write(payload, (err) => {
      done(err);
    });
  };

  it('should convert the payload to an influxdb line', (done) => {
    exec({
        user: { name: 'anonymous' },
        applicationName: 'my-app',
        featureName: 'my-feature',
        toggleName: 'my-toggle',
        value: false
    }, (err) => {
      if(err){
        return done(err);
      }

      calls[0].body.should.startWith('hobknob.my-app,toggle=my-feature/my-toggle,user=anonymous,env=test value=false');
      done();
    });
  });

  it('should set toggleName if undefined', (done) => {
    exec({
        user: { name: 'anonymous' },
        applicationName: 'my-app',
        featureName: 'my-feature',
        value: false
    }, (err) => {
      if(err){
        return done(err);
      }

      calls[0].body.should.startWith('hobknob.my-app,toggle=my-feature,user=anonymous,env=test value=false');
      done();
    });
  });

  it('should replace the config vars in the url', (done) => {
    exec({
        user: { name: 'anonymous' },
        applicationName: 'my-app',
        featureName: 'my-feature',
        value: false
    }, (err) => {
      if(err){
        return done(err);
      }

      calls[0].url.should.eql('http://127.0.0.1:8086/write?db=my_database&precision=ms');
      done();
    });
  });

  it('should set the auth credentials', (done) => {
    exec({
        user: { name: 'anonymous' },
        applicationName: 'my-app',
        featureName: 'my-feature',
        value: false
    }, (err) => {
      if(err){
        return done(err);
      }

      calls[0].auth.user.should.eql('user');
      calls[0].auth.pass.should.eql('password');
      done();
    });
  });

  it('should handle two-part names', (done) => {
    exec({
        user: { name: { givenName: 'anony', familyName: 'mous' } },
        applicationName: 'my-app',
        featureName: 'my-feature',
        value: false
    }, (err) => {
      if(err){
        return done(err);
      }

      calls[0].body.should.startWith('hobknob.my-app,toggle=my-feature,user=anony\\ mous');
      done();
    });
  });

  it('should apply any prefix set', (done) => {
    config.prefix = 'foo.bar';

    exec({
        user: { name: { givenName: 'anony', familyName: 'mous' } },
        applicationName: 'my-app',
        featureName: 'my-feature',
        value: false
    }, (err) => {
      if(err){
        return done(err);
      }

      calls[0].body.should.startWith('foo.bar.hobknob.my-app');
      done();
    });
  });

  it('should handle empty tags', (done) => {
    config.tags = {};

    exec({
        user: { name: { givenName: 'anony', familyName: 'mous' } },
        applicationName: 'my-app',
        featureName: 'my-feature',
        value: false
    }, (err) => {
      if(err){
        return done(err);
      }

      calls[0].body.should.startWith('hobknob.my-app,toggle=my-feature,user=anony\\ mous ');
      done();
    });
  });

  it('should handle multiple tags', (done) => {
    config.tags = {
      foo: 'foo',
      bar: 'bar'
    };

    exec({
        user: { name: 'anonymous' },
        applicationName: 'my-app',
        featureName: 'my-feature',
        value: false
    }, (err) => {
      if(err){
        return done(err);
      }

      calls[0].body.should.startWith('hobknob.my-app,toggle=my-feature,user=anonymous,foo=foo,bar=bar');
      done();
    });
  });
});
