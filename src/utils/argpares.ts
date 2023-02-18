export interface option {
    key: string[]
    name: string
    default?: string
}

export interface command {
    [key: string]: option[]
}

export interface schema {
    keyword: string
    commands?: command
    options?: option[]
}

export interface response {
    error?: string
    command: string | undefined
    [key: string]: string | undefined
}

/**
 * @param message 接收到的消息
 * @param schema 定义的消息格式
 * @returns 解析后的参数:  
 * error?: 错误信息;  
 * command?: 指令信息, 没有匹配到指令则为 undefined;  
 * args?: 参数信息, 根据接收到的消息生成. 类型为键值对,   
 *       没有值时值为 schema 中对应的 default 值   
 *       没有设置 default 时值为 undefined
 */
export function parse(message: string, schema: schema): response {
    let res: response = { command: undefined }
    let optionRegexp: string = "\\s+(-+\\w+)(?:\\s+(\\w+))?"
    let matchRegexp: string = `^${schema.keyword}(?:${optionRegexp})*$`
    let optionList: option[] = []

    /* 判断是否有 commands 指令 */
    if (schema.commands !== undefined) {
        let commandList: string = Object.keys(schema.commands).join("|")
        matchRegexp = `^${schema.keyword}(?:\\s+(${commandList}))?(?:${optionRegexp})*$`
    }

    /* 检查消息格式是否匹配 */
    let commandMatches: RegExpExecArray | null = RegExp(matchRegexp, "g").exec(message)
    if (commandMatches === null) {
        res.error = "消息不匹配"
        return res
    }

    /* 确认消息的 commands 指令 */
    res.command = commandMatches[1]
    if (res.command === undefined && schema.options !== undefined) {
        optionList = schema.options
    } else if (schema.commands !== undefined && res.command !== undefined) {
        optionList = schema.commands[res.command]
    }

    /* 匹配所有参数 */
    let optionMatches = message.matchAll(RegExp(optionRegexp, "g"))
    for (let match of optionMatches) {
        let flag: boolean = true
        let [key, value]: string[] | undefined[] = [match[1], match[2]]
        for (let option of optionList) {
            if (option.key.indexOf(key) === -1) { continue }
            if (option.default !== undefined && value === undefined) {
                value = option.default
            }
            res[option.name] = value // 将参数添加至返回值
            flag = false
            break
        }
        if (flag) {
            res.error = `错误的参数: ${key}`
            return res
        }
    }
    return res
}