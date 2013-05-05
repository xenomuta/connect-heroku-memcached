{Client,Server} = require('memjs')

module.exports = (connect) ->
  Store = connect.session.Store
  client = undefined

  class HerokuMemcachedStore extends Store
    constructor: (options={}) ->      
      Store.call(this, options);
      servers = []
      for server in options.servers
        if /^([^:]+):(\d+)$/.test server
          [_dummy,server,port] = server.match(/^([^:]+):(\d+)$/) 
        else port = 11211
        servers.push(new Server(server, port, options))
      client = new Client(servers)
    get: (sid, callback) ->
      client.get sid, (err, val, flags) ->
        try
          session = JSON.parse(val?.toString())
        session = (if val?.length > 0 then val.toString() else {cookie:{}} ) unless session?
        session.cookie = {} unless session.cookie?
        callback err, session
    set: (sid, session, callback)  ->
      client.set sid, JSON.stringify(session), (err, val) ->
        callback err, val
    destroy: (sid, callback) ->
      client.delete sid, (err, val) ->
        callback err, val

    # TODO: find out how do I implement this
    length:(callback)->callback false
    clear:(callback) ->callback false
