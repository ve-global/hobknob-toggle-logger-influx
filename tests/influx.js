'use strict';
var proxyquire = require('proxyquire').noCallThru();
var should = require('should');

describe('write', () => {
  var calls = [];
  var client = proxyquire('../lib/influx', {
    request: (options, cb) => {
      calls.push(options);
      cb(null, { statusCode: 204 });
    }
  });

  beforeEach(() => {
    calls = [];
  });

  it('should convert the payload to an influxdb line', (done) => {
    client.write({
        user: { name: 'anonymous' },
        applicationName: 'my-app',
        featureName: 'my-feature',
        toggleName: 'my-toggle',
        value: false
    }, (err) => {
      if(err){
        return done(err);
      }

      calls[0].body.should.startWith('hobknob.my-app.my-feature.my-toggle,user=anonymous,env=test value=false');
      done();
    });
  });

  it('should set toggleName if undefined', (done) => {
    client.write({
        user: { name: 'anonymous' },
        applicationName: 'my-app',
        featureName: 'my-feature',
        value: false
    }, (err) => {
      if(err){
        return done(err);
      }

      calls[0].body.should.startWith('hobknob.my-app.my-feature.toggle,user=anonymous,env=test value=false');
      done();
    });
  });

  it('should replace the config vars in the url', (done) => {
    client.write({
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
    client.write({
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

  it('should set handle two-part names', (done) => {
    client.write({
        user: { name: { givenName: 'anony', familyName: 'mous' } },
        applicationName: 'my-app',
        featureName: 'my-feature',
        value: false
    }, (err) => {
      if(err){
        return done(err);
      }

      calls[0].body.should.startWith('hobknob.my-app.my-feature.toggle,user=anony\\ mous');
      done();
    });
  });
});
