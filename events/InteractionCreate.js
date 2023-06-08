const { Events , EmbedBuilder, Collection } = require('discord.js')
const moment = require("moment")
const logger = require("../modules/Logger")
const fs = require("fs")

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const command = interaction.client.commands.get(interaction.commandName)
		const client = interaction.client

		interaction.client.db.query(`SELECT * FROM \`guilds\` WHERE \`guild_id\` = ${interaction.guildId}`, async (err, result) => {
			if (err) {
				logger.error(`There was an error !, InteractionCreate.js/query * from GUILDS`)
				logger.log(`${err}, ${err.stack}`)
				return
			  }

			if (result.length == 0) { //No Bot config Found
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

			if (interaction.isStringSelectMenu()) {
				if (interaction.customId == 'settings_menu' || 'lang_menu') {
					const subcommand = interaction.client.subcommands.get(interaction.values[0])
					try {
						return await subcommand.execute(interaction, client, lang)
					} catch (error) {
						interaction.client.guilds.fetch("1053988822498676776").then(guild => {
							guild.channels.fetch("1114365323462844496").then(channel => {
								channel.send(`[${moment().format("**YYYY-MM-DD HH:mm:ss:ms")}]: THERE WAS AN ERROR ❌**\n\n\n${error}`)
							})
						})
						logger.log(`Error executing ${interaction.values[0]}`, "error")
						console.error(error)
						return interaction.reply({
							content: `**${lang.x} ${lang.common_command_err}**`,
							ephemeral: true
						})
					}
				} else return
			}

			const { cooldowns } = interaction.client

			if (!cooldowns.has(command.data.name)) {
				cooldowns.set(command.data.name, new Collection())
			}

			const now = Date.now()
			const timestamps = cooldowns.get(command.data.name)
			const defaultCooldownDuration = 3
			const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000

			if (timestamps.has(interaction.user.id)) { //Cooldown check
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount

				if (now < expirationTime) {
					const expiredTimestamp = Math.round(expirationTime / 1000)
					return interaction.reply({
						content: `${lang.hourglass} ${lang.common_cooldown} <t:${expiredTimestamp}:R>`,
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
				return await command.execute(interaction, client, lang)

			} catch (error) {
				interaction.client.guilds.fetch("1053988822498676776").then(guild => {
					guild.channels.fetch("1114365323462844496").then(channel => {
						channel.send(`[${moment().format("**YYYY-MM-DD HH:mm:ss:ms")}]: THERE WAS AN ERROR ❌**\n\n\n${error}`)
					})
				})
				logger.log(`Error executing ${interaction.commandName}`, "error")
				console.error(error)
				return interaction.reply({
					content: `**${lang.x} ${lang.common_command_err}**`,
					ephemeral: true
				})
			}
		})
	}
}