(function() {
  var Client, Server, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('memjs'), Client = _ref.Client, Server = _ref.Server;

  module.exports = function(connect) {
    var HerokuMemcachedStore, Store, client;
    Store = connect.session.Store;
    client = void 0;
    return HerokuMemcachedStore = (function(_super) {

      __extends(HerokuMemcachedStore, _super);

      function HerokuMemcachedStore(options) {
        var port, server, servers, _, _i, _len, _ref1, _ref2;
        if (options == null) {
          options = {};
        }
        Store.call(this, options);
        servers = [];
        _ref1 = options.servers;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          server = _ref1[_i];
          if (/^([^:]+):(\d+)$/.test(server)) {
            _ref2 = server.match(/^([^:]+):(\d+)$/), _ = _ref2[0], server = _ref2[1], port = _ref2[2];
          } else {
            port = 11211;
          }
          servers.push(new Server(server, port, options));
        }
        client = new Client(servers);
      }

      HerokuMemcachedStore.prototype.get = function(sid, callback) {
        return client.get(sid, function(err, val, flags) {
          var session;
          try {
            session = JSON.parse(val.toString());
          } catch (_error) {}
          if (session == null) {
            session = (val&&val.length > 0 ? val.toString() : {
              cookie: {}
            });
          }
          if (session.cookie == null) {
            session.cookie = {};
          }
          return callback(err, session);
        });
      };

      HerokuMemcachedStore.prototype.set = function(sid, session, callback) {
        return client.set(sid, JSON.stringify(session), function(err, val) {
          return callback(err, val);
        });
      };

      HerokuMemcachedStore.prototype.destroy = function(sid, callback) {
        return client["delete"](sid, callback(function(err, val) {
          return callback(err, val);
        }));
      };

      HerokuMemcachedStore.prototype.length = function(callback) {
        return callback(false);
      };

      HerokuMemcachedStore.prototype.clear = function(callback) {
        return callback(false);
      };

      return HerokuMemcachedStore;

    })(Store);
  };

}).call(this);
