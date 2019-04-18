const libPath = require('path');

global.beforeEach(async () => {
    const { toMatchImageSnapshot } = require('jest-image-snapshot');
    expect.extend({ toMatchImageSnapshot });
    jest.setTimeout(60000);

    await kv.beforeEach();
});

global.afterEach(async () => {
    await kv.afterEach();
});

global.beforeAll(async () => {
    await kv.beforeAll();
});

global.afterAll(async () => {
    await kv.afterAll();
});