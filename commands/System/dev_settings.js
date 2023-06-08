const { SlashCommandBuilder, ActivityType } = require("discord.js")
const logger = require("../../modules/Logger")
const config = require("../../config.json")

module.exports = {

    category: `System`,
    data: new SlashCommandBuilder()
        .setName(`dev_settings`)
        .setDescription(`Changes the bot's Developer Settings`)
        .addSubcommand(eval => eval //eval subcommand
            .setName(`eval`)
            .setDescription(`Evaluates a code`)
            .addStringOption(code => code
                .setName(`code`)
                .setDescription(`Code to execute.`)
                .setRequired(true)
            )
        )

        .addSubcommand(reload => reload //reload subcommand
            .setName(`reload`)
            .setDescription(`Reloads the bot`)
            .addStringOption(command => command
                .setName(`command`)
                .setDescription(`Command to reload.`)
                .setRequired(true)
            )
        )

        .addSubcommand(debug => debug //debug subcommand
            .setName(`debug`)
            .setDescription(`Changes the bot's Debug Setting`)
            .addStringOption(value => value
                .setName(`state`)
                .setDescription(`The value to set the debug to.`)
                .setRequired(true)
                .addChoices(
                    { name: `Enable`, value: `true` },
                    { name: `Disable`, value: `false`}
                )
            )

            .addStringOption(bot => bot
                .setName(`bot_selection`)
                .setDescription(`Which bot to pass the argument to.`)
                .setRequired(true)
                .addChoices(
                    { name: `Production Bot`, value: `botID` },
                    { name: `Development Bot`, value: `devbotID`}
                )    
            )
        )

        .addSubcommandGroup(presence => presence //presence subcommandGroup
            .setName(`presence`)
            .setDescription(`Changes the bot's Presence`)
            .addSubcommand(status => status //status subcommand
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

            .addSubcommand(activity => activity //activity subcommand
                .setName(`activity`)
                .setDescription(`Changes the bot's Activity`)
                .addStringOption(type => type
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
                .addStringOption(value => value
                    .setName(`value`)
                    .setDescription(`Content of the Activity.`)
                    .setRequired(true)
                )
            )
        ),

    async execute (interaction, client, lang) {
        if (interaction.user.id !== "244370207190024193") { //Owner ID Check
            return interaction.reply({
                content: `**${lang.x} ${lang.common_permission_err}**`,
                ephemeral: true
            })
        }

        switch(interaction.options._subcommand) {
            case (`eval`): { //eval case
        
                try {
                    eval(`${interaction.options._hoistedOptions[0].value}`)
                    return interaction.reply({
                        content: `✅ Code successfully executed!`,
                        ephemeral: true
                    })
                } catch (error) {
                    interaction.reply({
                        content: `❌ There was an error! Check the logs for more info.`,
                        ephemeral: true
                    })
                    logger.error(`Error while executing code:`)
                    logger.log(interaction.options._hoistedOptions[0].value)
                    return console.log(error)
                }
            
            }

            case (`reload`): { //reload case
                const commandName = interaction.options.getString("command", true).toLowerCase()
                const command = client.commands.get(commandName)
        
                if (!command) {
                    return interaction.reply({
                        content: `There is no command with name \`${commandName}\`!`,
                        ephemeral: true
                    })
                }
        
                delete require.cache[require.resolve(`../${command.category}/${command.data.name}.js`)]
        
                try {
                    client.commands.delete(command.data.name)
                    const newCommand = require(`../${command.category}/${command.data.name}.js`)
                    client.commands.set(newCommand.data.name, newCommand)
                    return await interaction.reply({
                        content: `${lang.check} Command \`${newCommand.data.name}\` was reloaded!`,
                        ephemeral: true
                    })
                } catch (error) {
                    console.error(error)
                    return await interaction.reply({
                        content: `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``,
                        ephemeral: true
                    })
                }
            }

            case (`debug`): { //debug case
                return client.db.query(`UPDATE \`bot_config\` SET \`debug_mode\` = '${interaction.options._hoistedOptions[0].value}' WHERE \`bot_id\` = '${eval(`config.${interaction.options._hoistedOptions[1].value}`)}'`, (err) => {
                    if (err) {
                        logger.error(`There was an error !, InteractionCreate.js/query * from GUILDS`)
                        logger.log(`${err}, ${err.stack}`)
                        return
                    }

                    interaction.reply({
                        content: `${lang.check} Successfully changes the bot's debug to \`${interaction.options._hoistedOptions[0].value}\`!`,
                        ephemeral: true
                    })
                })
            }
            
            case(`status`): { //status case
                client.user.setPresence({
                    status: `${interaction.options._hoistedOptions[0].value}`
                })
                return interaction.reply({
                    content: `**${lang.check} Successfully changed the bot's status to ${interaction.options._hoistedOptions[0].value} !**`,
                    ephemeral: true
                })

            }
            
            case(`activity`): { //activity case
                if (interaction.options._hoistedOptions[0].value == `Remove`) {
                    await client.user.setPresence({
                        activities: [{
                            name: ``
                        }]
                    })
                    return interaction.reply({
                        content: `Successfully removed the bot's presence!`,
                        ephemeral: true
                    })
                }

                client.user.setPresence({
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