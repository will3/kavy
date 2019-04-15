const buffer = require('./buffer');
const guid = require('uuid/v4');
const libPath = require('path');

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
        const path = libPath.join(this.file, name);
        await this.rpc('screenshot', [path]);
    }

    async rpc(func, args) {
        args = args || [];
        const rpcId = guid();

        const start = Date.now();
        const waitTime = 20000;

        console.log('rpc', func, args);

        const checkInterval = 1000 / 60;

        const promise = new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const resolved = (buffer['rpc-resolve'] || {})[rpcId];
                const rejected = (buffer['rpc-reject'] || {})[rpcId];

                if (resolved != null) {
                    resolve(resolved.value);
                    clearInterval(interval);
                    console.log('rpc-resolve', func, args);
                } else if (rejected != null) {
                    reject(new Error(rejected.error));
                    clearInterval(interval);
                    console.log('rpc-reject', func, args);
                }

                if (Date.now() - start > waitTime) {
                    console.log('rpc-timeout', func, args);
                    reject(new Error(`Max wait time reached for rpc ${func} ${args}`));
                    clearInterval(interval);
                }
            }, checkInterval);
        });

        this.socket.emit('rpc', {
            id: rpcId,
            func,
            args
        });

        return promise;
    }
}

module.exports = Runner;