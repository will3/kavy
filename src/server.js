const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Runner = require('./runner');
const events = require('./events');
const buffer = require('./buffer');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const libPath = require('path');

app.use(bodyParser.urlencoded({ extended: true }));

var currentPath = process.cwd();

console.log('currentPath', currentPath);
const screenshotsDir = 'screenshots';

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
        let index = 0;

        while (true) {
            const filename = basename + (index === 0 ? '' : ` (${index})`) + '.jpg';
            path = libPath.join(dir, filename);

            if (fs.pathExistsSync(path)) {
                index++;
            } else {
                console.log(filename);
                cb(null, filename);
                break;
            }
        }
    }
});

const upload = multer({ storage });

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

app.post('/upload', upload.single('screenshot'), (req, res, next) => {});

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