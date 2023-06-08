const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")
const logger = require("../modules/Logger")
module.exports = {
    data: {
        name: "lang_fr",
        type: "subcommand"
    },
    
    async execute (interaction, client, lang) {
        client.db.query(`UPDATE \`guilds\` SET \`localization\`='fr-FR' WHERE \`guild_id\` = '${interaction.guildId}'`, (err) => {
            if (err) {
                logger.error(`There was an error !, lang_fr.js/`)
                logger.log(`${err}, ${err.stack}`)
            }

            interaction.update({
                content: `✅ Changement réussi de la langue du bot en français !`,
                components: [],
                ephemeral: true
            })
        })
    }
}