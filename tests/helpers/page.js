const puppeteer = require('puppeteer');

const sessionFactory = require('../factories/session-factory');
const userFactory = require('../factories/user-factory');

class CustomPage {
	static async build() {
		const browser = await puppeteer.launch({
			headless: false,
		});
		const page = await browser.newPage();
		const customPage = new CustomPage(page, browser);

		return new Proxy(customPage, {
			get: function (target, property) {
				return customPage[property] || browser[property] || page[property];
			},
		});
	}

	constructor(page) {
		this.page = page;
	}

	async login() {
		const user = await userFactory();
		const { session, signature } = sessionFactory(user);

		await this.page.setCookie({ name: 'session', value: session });
		await this.page.setCookie({ name: 'session.sig', value: signature });
		await this.page.goto('http://localhost:3000');

		await this.page.waitFor('a[href="/auth/logout"]');
	}
}

module.exports = CustomPage;
