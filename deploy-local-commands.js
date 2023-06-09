const { REST, Routes } = require('discord.js')
const { botID, devbotID, OmniServerID} = require('./config.json')
const { maintoken, devtoken } = require("./token.json")
const fs = require('node:fs')
const path = require('node:path')
const logger = require("./modules/Logger")

const commands = []
const subcommands = []
const commandsfoldersPath = path.join(__dirname, 'commands')
const commandsFolders = fs.readdirSync(commandsfoldersPath)

for (const folder of commandsFolders) {
	const commandsPath = path.join(commandsfoldersPath, folder)
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file)
		const command = require(filePath)

		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON())
			logger.log(`Loaded command ${command.data.name}`)

		} else {
			logger.log(`The command at ${filePath} is missing a required "data" or "execute" property.`, "warning")
		}
	}
}

const rest = new REST().setToken(devtoken);

(async () => {
	try {
		logger.log(`Started refreshing ${commands.length} application (/) commands.`, "log")

		const data = await rest.put(
			Routes.applicationGuildCommands(devbotID, OmniServerID),
			{ body: commands, subcommands },
		)

		logger.log(`Successfully reloaded ${data.length} application (/) commands.`, 'log')
        logger.log(`Successfully loaded ${data.length} application (/) commands!`, "success")
	} catch (error) {
		console.error(error)
	}
})()