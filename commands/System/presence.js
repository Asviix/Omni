const { SlashCommandBuilder, ActivityType } = require("discord.js")
const logger = require("../../modules/Logger")

module.exports = {

    category: `System`,
    data: new SlashCommandBuilder()
        .setName(`presence`)
        .setDescription(`Changes the bot's Rich Presence.`)
        .addSubcommand(subcommand => subcommand
            .setName(`status`)
            .setDescription(`Changes the bot's Status`)
            .addStringOption(option => option
                .setName(`parameter`)
                .setDescription(`Target status`)
                .setRequired(true)
                .addChoices(
                    { name: `online`, value: `online`},
                    { name: `idle`, value: `idle`},
                    { name: `dnd`, value: `dnd`},
                    { name: `invisible`, value: `invisible`}
                )
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`activity`)
            .setDescription(`Changes the bot's Activity`)
            .addStringOption(option => option
                .setName(`type`)
                .setDescription(`Type of the Activity.`)
                .setRequired(true)
                .addChoices(
                    { name: `Competing`, value: `Competing` },
                    { name: `Listening`, value: `Listening` },
                    { name: `Playing`, value: `Playing` },
                    { name: `Watching`, value: `Watching` },
                    { name: `Remove`, value: `Remove` }
                )
            )

            .addStringOption(option => option
                .setName(`value`)
                .setDescription(`Content of the Activity.`)
                .setRequired(true)
            )
        ),

    async execute (interaction, lang) {
        if (interaction.user.id !== "244370207190024193") {
            return interaction.reply({
                content: `**${lang.x}You are not allowed to use this command!**`,
                ephemeral: true
            })
        }

        switch(interaction.options._subcommand) {
            case(`status`): {
                interaction.client.user.setPresence({
                    status: `${interaction.options._hoistedOptions[0].value}`
                })
                return interaction.reply({
                    content: `**${lang.check} Successfully changed the bot's status to ${interaction.options._hoistedOptions[0].value} !**`,
                    ephemeral: true
                })

            } case(`activity`): {
                if (interaction.options._hoistedOptions[0].value == `Remove`) {
                    await interaction.client.user.setPresence({
                        activities: [{
                            name: ``
                        }]
                    })
                    return interaction.reply({
                        content: `Successfully removed the bot's presence!`,
                        ephemeral: true
                    })
                }

                interaction.client.user.setPresence({
                    activities: [{
                        type: eval(`ActivityType.${interaction.options._hoistedOptions[0].value}`),
                        name: interaction.options._hoistedOptions[1].value
                    }]
                })

                return interaction.reply({
                    content: `**${lang.check} Successfully changed the bot's activity to \`${interaction.options._hoistedOptions[0].value} ${interaction.options._hoistedOptions[1].value}\` !**`,
                    ephemeral: true
                })
            }
        }
    }
}


