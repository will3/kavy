const app = require('express')();
let http = require('http').Server(app);

const io = require('socket.io')(http);
const Runner = require('./runner');
const events = require('./events');
const buffer = require('./buffer');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const libPath = require('path');
const _ = require('lodash');
const config = require('./config');
const screenshotsDir = config.screenshotsDir;

app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = libPath.join(screenshotsDir, req.body.name);
        const dir = libPath.dirname(path);
        fs.ensureDirSync(dir);
        cb(null, dir);
    },
    filename: function(req, file, cb) {
        let path = libPath.join(screenshotsDir, req.body.name);
        const dir = libPath.dirname(path);
        let basename = libPath.basename(path);
        // let index = 0;

        // while (true) {
        //     const filename = basename + (index === 0 ? '' : ` (${index})`) + '.png';
        //     path = libPath.join(dir, filename);

        //     if (fs.pathExistsSync(path)) {
        //         index++;
        //     } else {
        //         console.log(filename);
        //         cb(null, filename);
        //         break;
        //     }
        // }
        // 
        cb(null, basename + '.png');
    }
});

const upload = multer({ storage });

const sockets = [];

io.on('connection', function(socket) {
    console.log('an user connected');
    events.emit('connect', socket);

    sockets.push(socket);

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

        _.remove(sockets, socket);
    });

    socket.on('error', function(err) {
        console.warn('Error', err);
    });
});

app.post('/upload', upload.single('screenshot'), (req, res, next) => {
    res.status(200).send();
});

let server;

function wireUpServer(server) {
    var connections = {};
    server.on('connection', function(conn) {
        var key = conn.remoteAddress + ':' + conn.remotePort;
        connections[key] = conn;
        conn.on('close', function() {
            delete connections[key];
        });
    });

    server.destroy = function(cb) {
        server.close(cb);
        for (var key in connections)
            connections[key].destroy();
    };
};


function connect(callback) {
    server = http.listen(8083, function() {
        console.log('listening on *:8083');
    });
    wireUpServer(server);

    events.on('connect', (socket) => {
        const runner = new Runner(socket);
        callback(runner);
    });

    return () => {
        console.log('closing...');
        return new Promise((resolve, reject) => {
            io.close();
            server.destroy();

            resolve();
        });
    };
};

module.exports = {
    connect
};