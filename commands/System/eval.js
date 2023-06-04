const { SlashCommandBuilder } = require("discord.js")
const logger = require("../../modules/Logger")

module.exports = {
    category: "System",
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Evaluates a command on the bot")
        .addStringOption(option => option
            .setName(`code`)
            .setDescription(`Code to execute.`)
            .setRequired(true)
        ),
    async execute (interaction, lang) {
        if (interaction.user.id !== "244370207190024193") {
            return interaction.reply({ content: `❌ You are not allowed to use this command!`, ephemeral: true })
        }

        try {
            eval(`${interaction.options._hoistedOptions[0].value}`)
            interaction.reply({ content: `✅ Code successfully executed!`, ephemeral: true })
        } catch (error) {
            interaction.reply({ content: `❌ There was an error! Check the logs for more info.`, ephemeral: true })
            console.log(error)
        }
    }
}