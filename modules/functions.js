module.exports = (client) => {
    client.addServer_Default = async (id) => {
        client.db.query(`INSERT INTO \`guilds\` (\`guild_id\`, \`localization\`, \`logs\`, \`disabled_commands\`) VALUES ('${id}', 'en-US', '{"enabled_logs": ""}', '{"disabled_commands": ""}')`, (err) => {
          if (err) client.logger.error(`There was an error ! ${err}, ${err.stack}`)
        })
    }
}