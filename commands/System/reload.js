const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    category: "System",
	data: new SlashCommandBuilder()
		.setName("reload")
		.setDescription("Reloads a command.")
		.addStringOption(option =>
			option.setName("command")
				.setDescription("The command to reload.")
				.setRequired(true)),
	async execute(interaction) {
        if (interaction.user.id !== "244370207190024193") {
            return interaction.reply({ content: `❌ You are not allowed to use this command!`, ephemeral: true })
        }

        const commandName = interaction.options.getString("command", true).toLowerCase()
		const command = interaction.client.commands.get(commandName)

		if (!command) {
			return interaction.reply({ content: `There is no command with name \`${commandName}\`!`, ephemeral: true })
		}

        delete require.cache[require.resolve(`../${command.category}/${command.data.name}.js`)]

        try {
    	    interaction.client.commands.delete(command.data.name)
	        const newCommand = require(`../${command.category}/${command.data.name}.js`)
	        interaction.client.commands.set(newCommand.data.name, newCommand)
	        await interaction.reply({ content: `${lang.check} Command \`${newCommand.data.name}\` was reloaded!`, ephemeral: true })
        } catch (error) {
	        console.error(error)
	        await interaction.reply({ content: `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``, ephemeral: true })
        }
	}
}