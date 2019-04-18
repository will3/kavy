describe('check in', function() {
    const signature = 'GXtWmWIs+77yYWROSRpzvgdREBERTRP5vMnohm/Ei8yB7RQN1F9ThVd8svZO6+b9G0sD3FfjsNmDVanA9v1ZqQZIoLqjwtl6Xpyspmg+VjvpP0dMZBgmAWvwQg8Pa1k2TLL+whJzKdhmZ50EOkMGomLlCjOWgs60gXrEd7IYrvSyfCw7bTaEeTyzu9OCLnfcF65LTHFHT8R0iQZz6A6IG717TzuxEwPJh27A4epRURdWtqgvsGWY6M87oluSnRH5uuWCwO72UNpiWbb3mTwsC016/TQUfDwXkdWlIPLFSwU2U/PJ0iRrgX7cizJ46PFwl2bMV6GwMexlGhmJAkvtuA==';

    beforeEach(async function() {
        await kv.route('GET', '/v3/check-in/qr', {
            loyaltyAccountCode: '3780'
        });

        await kv.route('GET', '/v3/vouchers/all', [{
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

        await kv.route('GET', '/v3/collector-cards', [{
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
    });

    test('add voucher', async function() {
        await kv.route('POST', '/v3/check-in', {
            code: 'd262a8b0-8ae1-47f2-97ba-29bddd8c2202',
            expiry: 1799
        });

        await kv.press('tabButton.checkIn');
        await kv.press('checkIn.introModal.okButton');
        await kv.press('callToActionVoucherButton');
        await kv.press('voucherList.voucher.0');
        await kv.press('voucherList.applyButton');

        await kv.pause(1000);

        expect(await kv.screenshot('check_in_apply_vouchers')).toMatchImageSnapshot();
    });

    test('add and remove voucher', async () => {
        await kv.route('POST', '/v3/check-in', {
            code: 'd262a8b0-8ae1-47f2-97ba-29bddd8c2202',
            expiry: 1799
        });

        await kv.press('tabButton.checkIn');
        await kv.press('checkIn.introModal.okButton');
        await kv.press('callToActionVoucherButton');
        await kv.press('voucherList.voucher.0');
        await kv.press('voucherList.applyButton');
        await kv.press('checkIn.removeVoucher');

        expect(await kv.screenshot('check_in_remove_voucher')).toMatchImageSnapshot();
    });

    test('add fly buys', async () => {
        await kv.route({
            method: 'GET',
            url: '/api/3/flybuys',
            body: [],
            headers: {
                signature
            }
        });

        await kv.route({
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

        await kv.press('tabButton.checkIn');
        await kv.press('checkIn.introModal.okButton');
        await kv.press('cardsAccordion.select');
        await kv.press('cardsAccordion.addFlyBuysButton');
        await kv.enter('flyBuys.cardInput', "6014351234567863");

        await kv.route({
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

        await kv.press('flyBuys.addButton');

        expect(await kv.screenshot('check_in_add_fly_buys')).toMatchImageSnapshot();
    });

    test('opens info', async () => {
        await kv.press("tabButton.checkIn");
        await kv.press("checkIn.introModal.okButton");
        await kv.press("checkIn.info");

        expect(await kv.screenshot('check_in_info')).toMatchImageSnapshot();
    });

    test('view stamp card', async () => {
        await kv.press("tabButton.checkIn");
        await kv.press("checkIn.introModal.okButton");
        await kv.press("checkIn.stampCards.0");

        expect(await kv.screenshot('check_in_stamp_card_drawer')).toMatchImageSnapshot();
    });
});