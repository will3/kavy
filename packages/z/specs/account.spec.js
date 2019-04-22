describe('account', () => {
	it('notifications', async () => {
		await kv.route('GET','/api/3/notifications',{items:[{id:'id-11898',created:'2019-03-06 14:40:02',type:'General',category_id:'0',category_icon:null,message:'Test -> All Users (no rate limit) -> Scheduled @ 2019-03-06 2:40',url:' '},{id:'id-11897',created:'2019-03-06 14:30:02',type:'General',category_id:'0',category_icon:null,message:'Test -> All Users -> Scheduled @ 2019-03-06 2:30',url:' '},{id:'id-11896',created:'2019-03-06 14:22:37',type:'General',category_id:'0',category_icon:null,message:'Test -> All users (no rate limit) -> Not Scheduled',url:' '},{id:'id-11895',created:'2019-03-06 14:10:01',type:'General',category_id:'0',category_icon:null,message:'Test -> All Users -> Not Scheduled',url:' '}]});

		await kv.press('tabButton.checkIn');
		await kv.press('checkIn.introModal.okButton');
		await kv.press('account.button');
		await kv.press('account.notifications');

		await kv.screenshot('account_notifications');
	});

	it('payment methods', async () => {
		await kv.press('tabButton.checkIn');
		await kv.press('checkIn.introModal.okButton');
		await kv.press('account.button');
		await kv.press('account.paymentMethods');

		await kv.screenshot('account_paymentMethods');
	});

	it('transactions', async () => {
		await kv.route('GET','/v2/transactions/fastlane',{_next:'/v2/transactions/fastlane?skip=100',items:[]});
		await kv.route('GET','/v1/transactions/zespress',{_next:'/v1/transactions/zespress?skip=100',items:[]});

		await kv.press('tabButton.checkIn');
		await kv.press('checkIn.introModal.okButton');
		await kv.press('account.button');
		await kv.press('account.transactions');

		await kv.screenshot('account_transactions');
	});

	it('loyalty cards', async () => {
		await kv.press('tabButton.checkIn');
		await kv.press('checkIn.introModal.okButton');
		await kv.press('account.button');
		await kv.press('account.loyaltyCards');

		await kv.screenshot('account_loyaltyCards');
	});

	it('vouchers', async () => {
		await kv.route('GET','/v3/vouchers/all',[{staticProductCode:'949189353654311220190001010100',validPeriod:{dateFrom:'2019-04-04T04:24:17+00:00',dateTo:'2019-07-03T11:59:59+00:00'},type:'FuelVoucher'}]);

		await kv.press('tabButton.checkIn');
		await kv.press('checkIn.introModal.okButton');
		await kv.press('account.button');
		await kv.press('account.vouchers');

		await kv.screenshot('account_vouchers');
	});

	it('stamp cards', async () => {
		await kv.route('GET','/v3/collector-cards',[{type:'Coffee',qualificationQuantity:6,quantityAccumulated:0},{type:'CarWash',qualificationQuantity:4,quantityAccumulated:0},{type:'Lpg',qualificationQuantity:3,quantityAccumulated:0}]);

		await kv.press('tabButton.checkIn');
		await kv.press('checkIn.introModal.okButton');
		await kv.press('account.button');
		await kv.press('account.stampCards');

		await kv.screenshot('account_stampCards');
	});

	it('fastlane', async () => {
		await kv.press('tabButton.checkIn');
		await kv.press('checkIn.introModal.okButton');
		await kv.press('account.button');
		await kv.press('account.notifications');
		await kv.press('account.fastlane');

		await kv.screenshot('account_fastlane');
	});

	// TODO
	// await kv.press('account.sharetank');
});