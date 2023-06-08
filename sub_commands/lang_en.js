const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")
const logger = require("../modules/Logger")

module.exports = {
    data: {
        name: "lang_en",
        type: "subcommand"
    },
    
    async execute (interaction, client, lang) {
        client.db.query(`UPDATE \`guilds\` SET \`localization\`='en-US' WHERE \`guild_id\` = '${interaction.guildId}'`, (err) => {
            if (err) {
                logger.error(`There was an error !, lang_en.js/`)
                logger.log(`${err}, ${err.stack}`)
            }

            interaction.update({
                content: `✅ Successfully changed the bot's language to English!`,
                components: [],
                ephemeral: true
            })
        })
    }
}