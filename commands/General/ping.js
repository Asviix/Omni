const { SlashCommandBuilder } = require("discord.js")
const logger = require("../../modules/Logger")

module.exports = {
    category: "General",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute (interaction, lang) {
        await interaction.deferReply()
        const reply = await interaction.fetchReply()
        const ping = reply.createdTimestamp - interaction.createdTimestamp

        interaction.editReply(`${lang.pong} ${lang.ping} ${ping}${lang.ping2}`)
    }
}