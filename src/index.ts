const { createClient } = require("oicq");

const account: number = 2770408964;

const bot: any = createClient(account);

bot.on("system.login.qrcode", function (this: any) {
	this.logger.mark("扫码后按Enter完成登录");
	process.stdin.once("data", () => {
		this.login();
	});
}).login();

module.exports.bot = bot;

// template plugins
require("./plugin/hello"); //hello world

process.on("unhandledRejection", (reason, promise) => {
	console.log("Unhandled Rejection at:", promise, "reason:", reason);
});
