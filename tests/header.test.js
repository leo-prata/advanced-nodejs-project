const Page = require('./helpers/page');

jest.setTimeout(10000);

let page;

beforeEach(async () => {
	page = await Page.build();
	await page.goto('http://localhost:3000');
});

afterEach(async () => {
	await page.close();
});

test('The header have the correct text', async () => {
	const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);
	expect(text).toEqual('Blogster');
});

test('Clicking login starts OAuth flow', async () => {
	await page.waitFor('.right a');
	await page.click('.right a');

	const url = await page.url();
	expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {
	await page.login();

	const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);
	expect(text).toEqual('Logout');
});
