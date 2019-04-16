const libPath = require('path');

global.beforeEach(async () => {
    const file = libPath.relative(__dirname, __filename);
    kv.file = file;

    const { toMatchImageSnapshot } = require('jest-image-snapshot');
    expect.extend({ toMatchImageSnapshot });
    jest.setTimeout(60000);

    await kv.reRender();
});