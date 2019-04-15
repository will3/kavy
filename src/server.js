const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Runner = require('./runner');
const events = require('./events');
const buffer = require('./buffer');

io.on('connection', function(socket) {
    console.log('an user connected');
    events.emit('connect', socket);

    socket.on('rpc-resolve', (id, value) => {
        if (buffer['rpc-resolve'] == null) {
            buffer['rpc-resolve'] = {};
        }

        buffer['rpc-resolve'][id] = { value };
    });

    socket.on('rpc-reject', (id, error) => {
        if (buffer['rpc-reject'] == null) {
            buffer['rpc-reject'] = {};
        }
        buffer['rpc-reject'][id] = { error };
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('error', function(err) {
        console.warn('Error', err);
    });
});

const server = http.listen(8083, function() {
    console.log('listening on *:8083');
});

function connect(callback) {
    events.on('connect', (socket) => {
        const runner = new Runner(socket);
        callback(runner);
    });

    return server;
};

module.exports = {
    connect
};