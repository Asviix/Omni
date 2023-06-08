const { SlashCommandBuilder } = require("discord.js")
const logger = require("../../modules/Logger")

module.exports = {
    category: "System",
	data: new SlashCommandBuilder()
		.setName("reboot")
		.setDescription("Reboots the bot!"),
	async execute(interaction, client, lang) {
        if (interaction.user.id !== "244370207190024193") {
            return interaction.reply({ content: `**${lang.x} ${lang.common_permission_err}**`, ephemeral: true })
        }

        await interaction.reply({
            content: "**Rebooting...**",
            ephemeral: true
        })

        await logger.warning("Bot rebooted!")

        await process.exit(0)
	}
}