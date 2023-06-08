const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")
const logger = require("../modules/Logger")

module.exports = {
    data: {
        name: "lang_nl",
        type: "subcommand"
    },
    
    async execute (interaction, client, lang) {
        client.db.query(`UPDATE \`guilds\` SET \`localization\`= 'nl-NL' WHERE \`guild_id\` = '${interaction.guildId}'`, (err) => {
            if (err) {
                logger.error(`There was an error !, lang_nl.js/`)
                logger.log(`${err}, ${err.stack}`)
            }

            interaction.update({
                content: `✅ De taal van de bot is succesvol veranderd naar Nederlands!`,
                components: [],
                ephemeral: true
            })
        })
    }
}