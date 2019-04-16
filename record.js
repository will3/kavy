const app = require('express')();
let http = require('http').Server(app);
const io = require('socket.io')(http);
const util = require('util');

server = http.listen(8084, function() {
    console.log('listening on *:8084');
});

io.on('connection', function(socket) {
    socket.on('disconnect', function() {});

    socket.on('events', function(event) {
        if (event.type === 'press') {
            const id = event.props.testID;
            if (id == null) {
                console.log(`component not mapped\nconstructor name: ${event.componentClass}\nprops:\n${util.inspect(event.props, {
                    depth: 2
                })}`);
            } else {
                console.log(`await kv.press('${id}');`);
            }
        }
    });
});