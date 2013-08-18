var connect = require('./mocks/connect'),
    should = require('should');

var HerokuMemcachedStore = require('../lib/connect-heroku-memcached')(connect);

describe('Client memcached', function () {
  var currentSID, store;

  before(function (done) {
    // Create connect heroku memcached instance before run tests
    store = new HerokuMemcachedStore({servers: ['localhost:11211']});
    done();
  });

  afterEach(function (done) {
    if (currentSID) {
      // Destroy current session created after each test
      store.destroy(currentSID, function (err, resp) {
        if (err) throw err;
        currentSID = undefined;
        done();
      });
    } else {
      done();
    }
  });

  it('should create and destroy session', function (done) {
    var session = {};

    // Create session
    store.set('FackeSID', session, function MemJSCallback(err, resp) {
      should.not.exist(err);
      resp.should.be.true;

      // Destroy session
      store.destroy('FackeSID', function MemJSCallback(err, resp) {
        should.not.exist(err);
        resp.should.be.true;

        done();
      });
    });
  });

  it('should get session', function (done) {
    var currentSID = 'FakeSID',
        session = { user: { id: '123' } };

    // Create session (stringified json in memcached)
    store.set(currentSID, session, function MemJSCallback(err, resp) {
      should.not.exist(err);
      resp.should.be.true;

      // Get session (string parsed to json)
      store.get(currentSID, function MemJSCallback(err, resp) {
        should.not.exist(err);
        resp.user.should.be.a('object');
        resp.user.id.should.equal('123');

        done();
      });
    });
  });

});
