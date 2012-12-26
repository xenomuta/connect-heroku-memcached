# Connect Heroku Memcached

A connect session store that implements the memcached binary protocol for use with heroku's and others memcache services.

Thanks to memcache binary protocol implementation in alevy's [memjs](https://github.com/alevy/memjs) library.

## Install

~~~sh
  npm install connect-heroku-memcached
~~~

## Usage

~~~javascript
  var HerokuMemcachedStore = require('connect-heroku-memcached')(express)
  ...
  app.use(express.session({
    secret: 'some secret for your cookie',
    store: new HerokuMemcachedStore({
      servers: ["server1", "server2", "server3:11711"]
      username: "username",
      password: "p4ssw0rd"})
    })
  );
~~~

