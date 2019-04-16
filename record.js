const app = require('express')();
let http = require('http').Server(app);
const io = require('socket.io')(http);
const util = require('util');
const { stringify } = require("javascript-stringify");
const { parse } = require('url');
const chalk = require('chalk');

server = http.listen(8084, function() {
    console.log('listening on *:8084');
});

io.on('connection', function(socket) {
    socket.on('disconnect', function() {});

    socket.on('events', function(event) {
        if (event.type === 'press') {
            const id = event.props.testID;
            if (id == null) {
                console.log(`component not mapped\nprops:\n${util.inspect(event.props, {
                    depth: 1
                })}`);
            } else {
                console.log('await kv.' + chalk.red('press') + `('${id}');`);
            }
        }
    });

    socket.on('routes', function(route) {
        const urlObject = parse(route.url);
        console.log('await kv.' + chalk.green('route') + `('${route.method}', '${urlObject.pathname}', ${stringify(route.body)})`);
    });
});