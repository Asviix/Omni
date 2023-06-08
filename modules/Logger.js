const colorette = require("colorette")
const { timeStamp } = require("console")
const moment = require("moment")

exports.log = (content, type = "log") => {
    const timestamp = `------------------------[${moment().format("YYYY-MM-DD HH:mm:ss:ms")}]:`
    switch (type) {
        case "log": {
            return console.log(`${timestamp} ${colorette.blue(content.toUpperCase())}`)
        }

        case "success": {
            return console.log(`${timestamp} ${colorette.bgGreen(content.toUpperCase())}`)
        }

        case "warning": {
            return console.log(`${timestamp} ${colorette.bgYellow(content.toUpperCase())}`)
        }

        case "error": {
            return console.log(`${timestamp} ${colorette.bgRed(content.toUpperCase())}`)
        }

        default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.")
    }
}

exports.success = (...args) => this.log(...args, "success")

exports.warning = (...args) => this.log(...args, "warning")

exports.error = (...args) => this.log(...args, "error")