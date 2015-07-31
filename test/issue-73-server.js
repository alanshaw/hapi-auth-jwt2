// see: https://github.com/dwyl/hapi-auth-jwt2/issues/73#issuecomment-126725339

var Hapi   = require('hapi');
var JWT    = require('jsonwebtoken');
var secret = 'NeverShareYourSecret';

// for debug options see: http://hapijs.com/tutorials/logging
var server = new Hapi.Server({ debug: false })
server.connection();

var plugin = require('../lib')

server.register(plugin, function(err) {

    if (err) {
        next(err)
        return false
    }

    server.auth.strategy('jwt', 'jwt', true, {
        key           : 'asdasdasdasdasdasd',
        validateFunc  :function(decoded, request, next) {
            console.log('test')
            return next(null, false)
        },
        verifyOptions : { algorithms: ['HS256'] }
    })

    console.log('test2')
    next(null)

    server.route([
        { method: 'GET',  path: '/', handler: home, config:{ auth: false } },
        { method: 'POST', path: '/privado', handler: privado, config: { auth: 'jwt' } },
        { method: 'POST', path: '/required', handler: privado, config: { auth: { mode: 'required', strategy: 'jwt' } } },
        { method: 'POST', path: '/optional', handler: privado, config: { auth: { mode: 'optional', strategy: 'jwt' } } },
        { method: 'POST', path: '/try', handler: privado, config: { auth: { mode: 'try', strategy: 'jwt' } } },
    ]);

})


module.exports = server;
