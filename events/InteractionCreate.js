const { Events , EmbedBuilder, Collection} = require('discord.js')
const moment = require("moment")
const logger = require("../modules/Logger")

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return
		const command = interaction.client.commands.get(interaction.commandName)

		interaction.client.db.query(`SELECT * FROM \`guilds\` WHERE \`guild_id\` = ${interaction.guildId}`, async (err, result) => {
			if (err) {
				logger.error(`There was an error!`)
				logger.log(`${err}`)
			}
			if (result.length == 0) {
				const config_error_embed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle(`Configuration Error`)
					.setAuthor(
						{ name: interaction.guild.members.me.displayName }
					)
					.setFooter(
						{ text: `Still having issues? /discord to ask our staff!` }
					)
					.addFields(
						{ name: `No Configuration found!`, value: `Creating, please wait...` }
					)
				const config_created_embed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle(`Configuration Error`)
					.setAuthor(
						{ name: interaction.guild.members.me.displayName }
					)
					.setFooter(
						{ text: `Still having issues? /discord to ask our staff!` }
					)
					.addFields(
						{ name: `Configuration created!`, value: `Please use the command again.` }
					)
				await interaction.reply({
					embeds: [config_error_embed],
					ephemeral: true
				})
				await interaction.client.addServer_Default(interaction.guildId)
				await interaction.editReply({
					embeds: [config_created_embed],
					ephemeral: true
				})
				return
			}

			interaction.language = result[0].localization

			lang = eval(`require("../localisation/${result[0].localization}")`) || require("../localisation/en-EN.json")

			const { cooldowns } = interaction.client

			if (!cooldowns.has(command.data.name)) {
				cooldowns.set(command.data.name, new Collection())
			}

			const now = Date.now()
			const timestamps = cooldowns.get(command.data.name)
			const defaultCooldownDuration = 3
			const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount

				if (now < expirationTime) {
					const expiredTimestamp = Math.round(expirationTime / 1000)
					return interaction.reply({
						content: `${lang.hourglass} ${lang.cooldown} <t:${expiredTimestamp}:R>`,
						ephemeral: true
					})
				}
				
			}
			
			timestamps.set(interaction.user.id, now)
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

			if (!command) {
				logger.log(`No command matching ${interaction.commandName} was found.`, "error")
				return
			}
	
			try {
				await command.execute(interaction, lang)
			} catch (error) {
				/*interaction.client.guilds.fetch("1053988822498676776").then(guild => {
					guild.channels.fetch("1114365323462844496").then(channel => {
						channel.send(`[${moment().format("**YYYY-MM-DD HH:mm:ss:ms")}]: THERE WAS AN ERROR ❌**\n\n\n${error}`)
					})
				})*/
				logger.log(`Error executing ${interaction.commandName}`, "error")
				console.error(error)
				return interaction.reply({
					content: `**${lang.x} ${lang.command_err}**`,
					ephemeral: true
				})
			}
		})
	}
}