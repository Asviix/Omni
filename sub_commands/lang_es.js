const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")
const logger = require("../modules/Logger")

module.exports = {
    data: {
        name: "lang_es",
        type: "subcommand"
    },
    
    async execute (interaction, client, lang) {
        client.db.query(`UPDATE \`guilds\` SET \`localization\`='es-ES' WHERE \`guild_id\` = '${interaction.guildId}'`, (err) => {
            if (err) {
                logger.error(`There was an error !, lang_es.js/`)
                logger.log(`${err}, ${err.stack}`)
            }

            interaction.update({
                content: `✅ ¡Se ha cambiado correctamente el idioma del bot a español!`,
                components: [],
                ephemeral: true
            })
        })
    }
}