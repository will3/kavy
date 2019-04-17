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
        const id = event.props.testID;
        if (id == null) {
            logComponentNotMapped(event);
            return;
        }

        switch (event.type) {
            case 'press':
                console.log('await kv.' + chalk.red('press') + `('${id}');`);
                break;
            case 'changeText':
                console.log('await kv.' + chalk.red('enter') + `('${id}', '${event.text}');`);
                break;
            case 'focus': 
                console.log('await kv.' + chalk.red('focus') + `('${id}');`);
                break;
            case 'blur': 
                console.log('await kv.' + chalk.red('blur') + `('${id}');`);
                break;
            default:
                console.log(chalk.gray('event: ' + util.inspect(event)));
                break;
        }
    });

    socket.on('routes', function(route) {
        const urlObject = parse(route.url);
        console.log('await kv.' + chalk.green('route') + `('${route.method}', '${urlObject.pathname}', ${stringify(route.body)})`);
    });
});

function logComponentNotMapped(event) {
    console.log(chalk.inverse('component not mapped\n') + chalk.gray(`event:\n${util.inspect(event, { depth: 1 })}`));
};