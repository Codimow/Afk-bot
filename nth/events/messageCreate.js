const afkManager = require('../utils/afkManager');

module.exports = {
    name: 'messageCreate',
    execute: async (message, client) => {
        if (message.author.bot) return;

        const prefix = '!'; // Replace with your bot's prefix

        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = client.commands.get(commandName);
            if (!command) return;

            try {
                await command.run(client, message, args);
            } catch (error) {
                console.error(error);
                await message.reply('There was an error executing that command.');
            }
        }

        await afkManager.handleMessage(message);
    }
};