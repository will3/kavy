const buffer = require('./buffer');
const guid = require('uuid/v4');
const libPath = require('path');
const config = require('./config');
const screenshotsDir = config.screenshotsDir;
const fs = require('fs-extra');

class Runner {
    constructor(socket) {
        this.socket = socket;
    }

    async press(id) {
        await this.rpc('press', [id]);
    }

    async enter(id, text) {
        await this.rpc('enter', [id, text]);
    }

    async focus(id) {
        await this.rpc('focus', [id]);
    }

    async blur(id) {
        await this.rpc('blur', [id]);
    }

    async type(id, text) {
        await this.rpc('type', [id, text]);   
    }

    async clearAsync() {
        await this.rpc('clearAsync');
    }

    async reRender() {
        await this.rpc('reRender');
    }

    async route(initOrMethod, url, response) {
        await this.rpc('route', [initOrMethod, url, response]);
    }

    async screenshot(name) {
        if (name == null) {
            throw new Error('screenshot must be named');
        }
        await this.rpc('screenshot', [ name ]);
        const imagePath = libPath.join(screenshotsDir, name + '.png');
        const image = fs.readFileSync(imagePath);
        return image;
    }

    async pause(ms) {
        await this.rpc('pause');
    }

    async rpc(func, args) {
        args = args || [];
        const rpcId = guid();

        const start = Date.now();
        const waitTime = 60000;

        const checkInterval = 1000 / 60;

        this.socket.emit('rpc', {
            id: rpcId,
            func,
            args
        });
        
        await new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const resolved = (buffer['rpc-resolve'] || {})[rpcId];
                const rejected = (buffer['rpc-reject'] || {})[rpcId];

                if (resolved != null) {
                    resolve(resolved.value);
                    clearInterval(interval);
                } else if (rejected != null) {
                    reject(new Error(rejected.error));
                    clearInterval(interval);
                }

                if (Date.now() - start > waitTime) {
                    reject(new Error(`Max wait time reached for rpc ${func} ${args}`));
                    clearInterval(interval);
                }
            }, checkInterval);
        });
    }
}

module.exports = Runner;