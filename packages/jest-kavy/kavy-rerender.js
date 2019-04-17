const libPath = require('path');

global.beforeEach(async () => {
    const { toMatchImageSnapshot } = require('jest-image-snapshot');
    expect.extend({ toMatchImageSnapshot });
    jest.setTimeout(60000);

    await kv.reRender();
});