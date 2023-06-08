const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require("discord.js")
const logger = require("../../modules/Logger")

module.exports = {
    category: "Configuration",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Allows to change all the settings of the bot."),

    async execute (interaction, client, lang) {

        const settingSelect = new StringSelectMenuBuilder()
            .setCustomId(`settings_menu`)
            .setPlaceholder(lang.settings_settingSelect_Placeholder)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(lang.settings_settingSelect_language_label)
                    .setDescription(lang.settings_settingSelect_language_desc)
                    .setValue(`lang_menu`)
            )
        const settingRow = new ActionRowBuilder()
            .addComponents(settingSelect)

        await interaction.reply({
            components: [settingRow],
            ephemeral: true
        })
    }
}