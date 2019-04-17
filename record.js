const app = require('express')();
let http = require('http').Server(app);
const io = require('socket.io')(http);
const util = require('util');
const { stringify } = require("javascript-stringify");
const { parse } = require('url');
const chalk = require('chalk');
const _ = require('lodash');

server = http.listen(8084, function() {
    console.log('listening on *:8084');
});

io.on('connection', function(socket) {
    socket.on('disconnect', function() {});

    socket.on('events', function(event) {
        logEvent(event);
    });

    socket.on('routes', function(route) {
        const urlObject = parse(route.url);
        console.log('await kv.' + chalk.green('route') + `('${route.method}', '${urlObject.pathname}', ` + chalk.gray(stringify(route.body)) + ')');
    });
});

const eventBuffer = {};
const eventBufferWait = 50;

function flushEvents(events) {
    let found = null;
    for(let i = 0; i < events.length; i++) {
        const event = events[i];
        if (_.get(event, 'props.testID') != null) {
            found = event;
            break;
        }
    }

    if (found == null) {
        console.log('-----------------------');
        for(let i = 0; i < events.length; i ++) {
            logEvent(events[i]);    
        }
    } else {
        logEvent(found);
    }
};

const colorRed = '#FA297D';
const colorBlue = '#6ED6EA';
const colorYellow = '#EAE07F';

function logEvent(event) {
    const id = _.get(event, 'props.testID');
    if (id == null) {
        logComponentNotMapped(event);
        return;
    }

    switch (event.type) {
        case 'press':
            console.log(chalk.hex(colorRed)('await ') + 'kv.' + chalk.hex(colorBlue)('press') + brackets(quotes(id)));
            break;
        case 'changeText':
            console.log(chalk.hex(colorRed)('await ') + 'kv.' + chalk.hex(colorBlue)('enter') + brackets(args(quotes(id), quotes(event.text))));
            break;
        case 'focus':
            console.log(chalk.hex(colorRed)('await ') + 'kv.' + chalk.hex(colorBlue)('focus') + brackets(quotes(id)));
            break;
        case 'blur':
            console.log(chalk.hex(colorRed)('await ') + 'kv.' + chalk.hex(colorBlue)('blur') + brackets(quotes(id)));
            break;
        default:
            console.log('----------------------');
            console.log(chalk.gray('event: ' + util.inspect(event)));
            break;
    };
};

function quotes(string) {
    return '\'' + chalk.hex(colorYellow)(string) + '\'';
}

function brackets(string) {
    return '(' + string + ')';
}

function args(array) {
    let result = '';
    for (let i = 0; i < array.length; i++) {
        result += array[i];
        if (i !== array.length - 1) {
            result += ', ';
        }
    }
    return result;
}

function logComponentNotMapped(event) {
    console.log(chalk.inverse('component not mapped\n') + chalk.gray(`event:\n${util.inspect(event, { depth: 1 })}`));
};