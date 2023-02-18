const { bot } = require("../index")
import { parse, schema, response } from "../utils/argpares"


const formatStr: schema = {
    keyword: "echo",
    commands: {
        start: [
            { key: ["--uuid"], name: "uuid" },
            { key: ["-id"], name: "id" },
            { key: ["-m", "--message"], name: "message" },
            { key: ["-t", "--time"], name: "time" },
            { key: ["-s", "--spacing"], name: "spacing" }
        ],
        stop: [
            { key: ["--uuid"], name: "uuid" },
        ],
        ps: []
    }
}

function start(options: response):string {
    let uuid: string = Date.now().toString()
    let id: number = 0
    let message: string = ""
    let time: number = 3
    let spacing: number = 10

    if (options.uuid!==undefined) {uuid = options.uuid}
    if (options.id!==undefined) {id = parseInt(options.id)}
    if (options.message!==undefined) {message = options.message}
    if (options.time!==undefined) {time = parseInt(options.time)}
    if (options.spacing!==undefined) {spacing = parseInt(options.spacing)}

    //TODO 创建复读任务
    console.log(uuid, id, message, time, spacing)

    return uuid
}

bot.on("message", function (msg: any): void {
    /* 解析消息 */
    let option: response = parse(msg.raw_message, formatStr)

    if (option.error !== undefined && option.error !== "消息不匹配") {
        /* 错误信息 */
        msg.reply(`Error: ${option.error}`, true)
    } else if (option.command === "start") {
        let response = start(option)
        msg.reply(response, false)
    }
})

export { };