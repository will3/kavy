const app = require('express')();
let http = require('http').Server(app);
const io = require('socket.io')(http);
const util = require('util');
const { stringify } = require("javascript-stringify");
const { parse } = require('url');
const chalk = require('chalk');
const _ = require('lodash');
const argv = require('minimist')(process.argv.slice(2));

server = http.listen(8084, function() {
    console.log('listening on *:8084');
})

io.on('connection', function(socket) {
    socket.on('disconnect', function() {});

    socket.on('events', function(event) {
        logEvent(event);
    });

    socket.on('routes', function(route) {
        if (argv.routes) {
            logRoute(route);    
        }
    });
})

const routes = [];
function throttleRoute(route) {
    const matching = routes.find((r) => {
        return r.method === route.method && 
        r.url === route.url &&
        r.status === route.status;
    });

    if (matching == null) {
        routes.push(route);
        logRoute(route);
    }
}

const eventBuffer = {};
const eventBufferWait = 50;

const colorRed = '#FA297D';
const colorBlue = '#6ED6EA';
const colorYellow = '#EAE07F';
const colorGreen = '#ABE230';
const colorComment = '#7F7B68';
const colorPurple = '#B58BFF';

function isControlEvent(event) {
    return _.includes(['press', 'changeText', 'focus', 'blur'], event.type);
}

function logEvent(event) {
    const id = event.id;

    if (isControlEvent(event)) {
        if (id == null) {
            logComponentNotMapped(event);
            return;
        }
    }

    switch (event.type) {
        case 'press':
            console.log(formatAwait() + 'kv.' + formatFunc('press') + brackets(quotes(id)) + ";");
            break;
        case 'changeText':
            console.log(formatAwait() + 'kv.' + formatFunc('enter') + brackets(args(quotes(id), quotes(event.text))) + ";");
            break;
        case 'focus':
            console.log(formatAwait() + 'kv.' + formatFunc('focus') + brackets(quotes(id)) + ";");
            break;
        case 'blur':
            console.log(formatAwait() + 'kv.' + formatFunc('blur') + brackets(quotes(id)) + ";");
            break;
        case 'testerMounted':
            console.log('// -------------- START --------------');
            routes.splice(0, routes.length);
            break;
        default:
            console.log(chalk.gray('event: ' + util.inspect(event)));
            break;
    };
}

function quotes(string, options) {
    options = options || {};
    const color = options.color;
    const colorFunc = color == null ? chalk.hex(colorYellow) : chalk.hex(color);
    return '\'' + colorFunc(string) + '\'';
}

function brackets(string) {
    return '(' + string + ')';
}

function args(...array) {
    let result = '';
    for (let i = 0; i < array.length; i++) {
        result += array[i];
        if (i !== array.length - 1) {
            result += ', ';
        }
    }
    return result;
}

function comments(string) {
    return string.split('\n').map((line) => {
        return chalk.hex(colorComment)('// ' + line);
    }).join('\n');
}

function formatAwait() {
    return chalk.hex(colorRed)('await ');
}

function formatFunc(funcName, options) {
    options = options || {};
    const color = options.color;
    const colorFunc = color == null ? chalk.hex(colorBlue) : chalk.hex(color);
    return colorFunc(funcName);
}

function literal(string) {
    return chalk.hex(colorPurple)(string);
}

function logComponentNotMapped(event) {
    console.log(comments(chalk.inverse('component not mapped')));
    console.log(comments(`event:\n${util.inspect(event, { depth: 1 })}`));
}

function logRoute(route) {
    const urlObject = parse(route.url);

    const params = [
        quotes(route.method),
        quotes(urlObject.pathname)
    ];

    const third = route.body == null ? literal('null') : chalk.hex(colorComment)(stringify(route.body));

    params.push(third);

    if (route.status != 200) {
        params.push(literal(route.status));
    }

    console.log(formatAwait() + 'kv.' + formatFunc('route', {
        color: colorGreen
    }) + brackets(args(params)) + ";");
}