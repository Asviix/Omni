const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")
const logger = require("../modules/Logger")

module.exports = {
    data: {
        name: "lang_de",
        type: "subcommand"
    },
    
    async execute (interaction, client, lang) {
        client.db.query(`UPDATE \`guilds\` SET \`localization\`='de-DE' WHERE \`guild_id\` = '${interaction.guildId}'`, (err) => {
            if (err) {
                logger.error(`There was an error !, lang_de.js/`)
                logger.log(`${err}, ${err.stack}`)
            }

            interaction.update({
                content: `✅ Die Sprache des Bots wurde erfolgreich auf Deutsch geändert!`,
                components: [],
                ephemeral: true
            })
        })
    }
}