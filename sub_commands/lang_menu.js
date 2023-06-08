const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")
const logger = require("../modules/Logger")

module.exports = {
    data: {
        name: "lang_menu",
        type: "subcommand"
    },
    
    async execute (interaction, client, lang) {
        const langSelect = new StringSelectMenuBuilder()
            .setCustomId(`lang_menu`)
            .setPlaceholder(lang.lang_menu_langSelect_Placeholder)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(`English (US)`)
                    .setValue(`lang_en`),

                new StringSelectMenuOptionBuilder()
                    .setLabel(`German`)
                    .setValue(`lang_de`),

                new StringSelectMenuOptionBuilder()
                    .setLabel(`Spanish`)
                    .setValue(`lang_es`),

                new StringSelectMenuOptionBuilder()
                    .setLabel(`French`)
                    .setValue(`lang_fr`),

                new StringSelectMenuOptionBuilder()
                    .setLabel(`Dutch`)
                    .setValue(`lang_nl`)
            )
        const langRow = new ActionRowBuilder()
            .addComponents(langSelect)
        
        interaction.update({
            components: [langRow],
            ephemeral: true
        })
    }
}