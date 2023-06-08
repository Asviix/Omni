const { REST, Routes } = require('discord.js')
const { botID, devbotID, OmniServerID} = require('./config.json')
const { maintoken, devtoken } = require("./token.json")
const logger = require("./modules/Logger")

const rest = new REST().setToken(maintoken);

rest.put(Routes.applicationGuildCommands(botID, OmniServerID), { body: [] })
	.then(() => logger.success('Successfully deleted all guild commands.'))
	.catch(console.error);

rest.put(Routes.applicationCommands(botID), { body: [] })
	.then(() => logger.success('Successfully deleted all application commands.'))
	.catch(console.error);