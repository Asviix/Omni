const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js")
const logger = require("../../modules/Logger")

module.exports = {
    category: "Configuration",
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Allows to change all the settings of the bot.")
        .addStringOption(option => option
            .setName("setting")
            .setDescription("The bot setting you wish to change. (Help to see a list of avaliable settings.)")
            .setRequired(true)
            .addChoices(
                { name: "Help", value: "Help" },
                { name: "Language", value: "Language" },
            )
        ),

    async execute (interaction, lang) {
        if (interaction.user.id !== "244370207190024193") {
            return interaction.reply({ content: `❌ You are not allowed to use this command!`, ephemeral: true })
        }

        switch (interaction.options._hoistedOptions[0].value) {
            case(`Help`): {
                const SettingsMainMenu_Embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(lang.settings_main_menu)
                .setAuthor(
                    { name: interaction.guild.members.me.displayName }
                )
                .setFooter(
                    { text: lang.embed_default_footer }
                )
                .addFields(
                    { name: lang.settings_you_can_change, value: lang.settings_you_can_change_list }
                )
                return interaction.reply({ embeds: [SettingsMainMenu_Embed] })
            }

            case(`Language`): {
                const SettingsLanguageMenu_Embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(lang.settings_language_title)
                .setAuthor(
                    { name: interaction.guild.members.me.displayName }
                )
                .setFooter(
                    { text: lang.embed_default_footer }
                )
                .addFields(
                    { name: lang.settings_language_field1, value: lang.settings_language_field2 }
                )
                .addFields(
                    { name: lang.settings_language_field3, value: lang.settings_language_field4 }
                )
                return interaction.reply({ embeds: [SettingsLanguageMenu_Embed] })
            }

            default: return interaction.reply({ content: lang.settings_error_no_argument, ephemeral: true })
        }
    }
}