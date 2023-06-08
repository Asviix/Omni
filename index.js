//#region MODULES
const Discord = require("discord.js")
const { GatewayIntentBits } = require("discord.js")
const { promisify } = require("util")
const fs = require("node:fs")
const path = require("node:path")
const mysql = require("mysql")
//#endregion

const client = new Discord.Client({ intents: [GatewayIntentBits.Guilds] })

//#region CONST
const config = require("./config.json")
const dbpassword = require("./dbpassword.json")
const { maintoken, devtoken } = require("./token.json")
const logger = require("./modules/Logger")
//#endregion

client.db = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: "",
    password: dbpassword,
    charset: "utf8_bin",
    database: "omni"
})

client.db.connect(function(err) {
    if (err) throw err
    logger.success(`Successfully connected to database!`)
})

client.commands = new Discord.Collection()
client.subcommands = new Discord.Collection()
client.cooldowns = new Discord.Collection()
require("./modules/functions") (client)

const init = async () => {

    const commandsfoldersPath = path.join(__dirname, "commands")
    const commandsFolders = fs.readdirSync(commandsfoldersPath)
	const subcommandsPath = path.join(__dirname, "sub_commands")
	const subcommandsFiles = fs.readdirSync(subcommandsPath).filter(file => file.endsWith('.js'))

    for (const folder of commandsFolders) {
	    const commandsPath = path.join(commandsfoldersPath, folder)
	    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))
	    for (const file of commandFiles) {
    		const filePath = path.join(commandsPath, file)
		    const command = require(filePath)
		    if ("data" in command && "execute" in command) {
    			client.commands.set(command.data.name, command)
                logger.log(`Loaded command: ${command.data.name}`)
		    } else {
    			logger.warning(`The command at ${filePath} is missing a required "data" or "execute" property.`)
		    }
	    }
    }

	for (const file of subcommandsFiles) {
		const filePath = path.join(subcommandsPath, file)
		const subcommand = require(filePath)
		if ('data' in subcommand && 'execute' in subcommand) {
			client.subcommands.set(subcommand.data.name, subcommand)
			logger.log(`Loaded sub command: ${subcommand.data.name}`)
		} else {
			logger.warning(`The command at ${filePath} is missing a required "data" or "execute" property.`)
		}
	}

    const eventsPath = path.join(__dirname, "events")
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"))

    for (const file of eventFiles) {
    	const filePath = path.join(eventsPath, file)
    	const event = require(filePath)
    	if (event.once) {
		    client.once(event.name, (...args) => event.execute(...args))
	    } else {
    		client.on(event.name, (...args) => event.execute(...args))
    	}
    }

	client.init_db()
}

client.login(devtoken)

init()