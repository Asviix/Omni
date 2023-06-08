const { SlashCommandBuilder } = require("discord.js")
const logger = require("../../modules/Logger")

module.exports = {
    category: "General",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute (interaction, client, lang) {
        await interaction.deferReply({
            ephemeral:true
        })
        const reply = await interaction.fetchReply()
        const ping = reply.createdTimestamp - interaction.createdTimestamp

        interaction.editReply({
            content: `${lang.pong} ${eval(lang.ping)}`,
            ephemeral: true
        })
    }
}