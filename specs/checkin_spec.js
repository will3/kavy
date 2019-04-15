const connect = require('../src/server').connect;


describe('check in', () => {
    let runner, server;
    const signature = 'GXtWmWIs+77yYWROSRpzvgdREBERTRP5vMnohm/Ei8yB7RQN1F9ThVd8svZO6+b9G0sD3FfjsNmDVanA9v1ZqQZIoLqjwtl6Xpyspmg+VjvpP0dMZBgmAWvwQg8Pa1k2TLL+whJzKdhmZ50EOkMGomLlCjOWgs60gXrEd7IYrvSyfCw7bTaEeTyzu9OCLnfcF65LTHFHT8R0iQZz6A6IG717TzuxEwPJh27A4epRURdWtqgvsGWY6M87oluSnRH5uuWCwO72UNpiWbb3mTwsC016/TQUfDwXkdWlIPLFSwU2U/PJ0iRrgX7cizJ46PFwl2bMV6GwMexlGhmJAkvtuA==';

    before(async () => {
        runner = await new Promise((resolve, reject) => {
            server = connect((r) => {
                resolve(r);
            });
        });
    });

    after(() => {
        server.close();
    });

    beforeEach(async () => {
        await runner.reRender();
    });

    it('Add voucher', async () => {
        await runner.route('GET', '/v3/check-in/qr', {
            loyaltyAccountCode: '3780'
        });

        await routeVouchers();

        await runner.route('POST', '/v3/check-in', {
            code: 'd262a8b0-8ae1-47f2-97ba-29bddd8c2202',
            expiry: 1799
        });

        await runner.press('tabButton.checkIn');
        await runner.press('checkIn.introModal.okButton');
        await runner.press('callToActionVoucherButton');
        await runner.press('voucherList.voucher.0');
        await runner.press('voucherList.applyButton');
    });

    it('Add and remove voucher', async () => {
        runner.route('GET', '/v3/check-in/qr', {
            loyaltyAccountCode: '3780'
        });

        routeVouchers();

        runner.route('POST', '/v3/check-in', {
            code: 'd262a8b0-8ae1-47f2-97ba-29bddd8c2202',
            expiry: 1799
        });

        await runner.press('tabButton.checkIn');
        await runner.press('checkIn.introModal.okButton');
        await runner.press('callToActionVoucherButton');
        await runner.press('voucherList.voucher.0');
        await runner.press('voucherList.applyButton');
        await runner.press('checkIn.removeVoucher');
    });

    it('Add fly buys', async () => {
        await runner.route('GET', '/v3/check-in/qr', {
            loyaltyAccountCode: '3780'
        });

        await runner.route({
            method: 'GET',
            url: '/api/3/flybuys',
            body: [],
            headers: {
                signature
            }
        });

        await runner.route({
            method: 'POST',
            url: '/api/3/flybuys/add_card',
            status: 200,
            headers: {
                signature
            },
            body: [{
                'card_number': '2645521028539',
                'is_default': true
            }]
        });

        await runner.press('tabButton.checkIn');
        await runner.press('checkIn.introModal.okButton');
        await runner.press('cardsAccordion.select');
        await runner.press('cardsAccordion.addFlyBuysButton');
        await runner.enter('flyBuys.cardInput', "6014351234567863");

        await runner.route({
            method: 'GET',
            url: '/api/3/flybuys',
            body: [{
                'card_number': '2645521028539',
                'is_default': true
            }],
            headers: {
                signature
            }
        });

        await runner.press('flyBuys.addButton');
    });

    it('Opens info', async () => {
        await runner.route('GET', '/v3/check-in/qr', {
            loyaltyAccountCode: '3780'
        });

        await runner.press("tabButton.checkIn");
        await runner.press("checkIn.introModal.okButton");
        await runner.press("checkIn.info");
    });

    it('View stamp card', async () => {
        await runner.route('GET', '/v3/check-in/qr', {
            loyaltyAccountCode: '3780'
        });

        await runner.route('GET', '/v3/collector-cards', [{
                type: 'Coffee',
                qualificationQuantity: 6,
                quantityAccumulated: 0
            },
            {
                type: 'CarWash',
                qualificationQuantity: 4,
                quantityAccumulated: 0
            },
            {
                type: 'Lpg',
                qualificationQuantity: 3,
                quantityAccumulated: 0
            }
        ]);

        await runner.press("tabButton.checkIn");
        await runner.press("checkIn.introModal.okButton");
        await runner.press("checkIn.stampCards.0");
    });

    async function routeVouchers() {
        await runner.route('GET', '/v3/vouchers/all', [{
                loyaltyOfferCode: '1005407',
                validPeriod: {
                    dateFrom: '2019-04-03T12:00:00+00:00',
                    dateTo: '2019-07-03T11:59:59+00:00'
                },
                type: 'FreeCoffee'
            },
            {
                loyaltyOfferCode: '1005408',
                validPeriod: {
                    dateFrom: '2019-04-03T12:00:00+00:00',
                    dateTo: '2019-07-03T11:59:59+00:00'
                },
                type: 'FreeCarWash'
            },
            {
                staticProductCode: '949189353654311220190001010100',
                validPeriod: {
                    dateFrom: '2019-04-04T04:24:17+00:00',
                    dateTo: '2019-07-03T11:59:59+00:00'
                },
                type: 'FuelVoucher'
            }
        ]);
    };
});