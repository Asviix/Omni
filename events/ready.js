const { Events } = require('discord.js')
const logger = require("../modules/Logger")
const moment = require("moment")

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		logger.success(`Ready! Logged in as ${client.user.tag}`)
		/*client.guilds.fetch("1053988822498676776").then(guild => {
			guild.channels.fetch("1114365323462844496").then(channel => {
				channel.send(`[${moment().format("**YYYY-MM-DD HH:mm:ss:ms")}]: Bot is ready! ✅**`)
			})
		})*/
	}
}