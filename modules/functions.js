const logger = require("./Logger")

module.exports = (client) => {
    client.addServer_Default = async (id) => {
        client.db.query(`INSERT INTO \`guilds\`(\`guild_id\`, \`localization\`, \`logs\`, \`disabled_commands\`) VALUES ('${id}','en-US','{"enabled_logs": ""}','{"disabled_commands": "{}"}')`, (err) => {
          if (err) {
            logger.error(`There was an error !, function.js/addServer_default`)
            logger.log(`${err}, ${err.stack}`)
          }
        })
    }

    client.init_db = async () => {
      client.db.query(`SELECT * FROM \`bot_config\``, (err, result) => {
        if (err) {
          logger.error(`There was an error !, function.js/init_db`)
          logger.log(`${err}, ${err.stack}`)
        }

        if (!result.length) {
          logger.warning(`Bot config empty! Creating...`)
          client.db.query(`INSERT INTO \`bot_config\`(\`debug_mode\`, \`disabled_commands\`) VALUES ('0','{"disabled_commands": "{}"}')`, (err) => {
            if (err) {
              logger.error(`There was an error !`)
              logger.log(`${err}, ${err.stack}`)
            }

            logger.success(`Config Successfully created!`)
          })
        }
        
        else return
      })
    }
}