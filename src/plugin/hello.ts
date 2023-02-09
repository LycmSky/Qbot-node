const { bot } = require("../index")

bot.on("message", function (msg: any): void {
    if (msg.raw_message === "hello")
        msg.reply("hello world", true) //改为false则不会引用
})

export { };