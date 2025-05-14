const puppeteer = require('puppeteer');

const sessionFactory = require('../factories/session-factory');
const userFactory = require('../factories/user-factory');

class CustomPage {
	static async build() {
		const browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox'],
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
		await this.page.goto('http://localhost:3000/blogs');

		await this.page.waitFor('a[href="/auth/logout"]');
	}

	async getContentOf(selector) {
		return this.page.$eval(selector, (el) => el.innerHTML);
	}
}

module.exports = CustomPage;
