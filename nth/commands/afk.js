const { EmbedBuilder } = require('discord.js');
const afkManager = require('../utils/afkManager');

module.exports = {
    name: 'afk',
    description: 'Set your AFK status',
    run: async (client, message, args) => {
        const afkReason = args.join(' ') || 'AFK';
        afkManager.setAfk(message.author.id, afkReason);

        const afkEmbed = new EmbedBuilder()
            .setColor('#FFCC00')
            .setTitle('AFK Status')
            .setDescription(`${message.author} is now AFK.`)
            .addFields({ name: 'Reason', value: afkReason })
            .setTimestamp();

        await message.channel.send({ embeds: [afkEmbed] });
        await message.member.setNickname(`[AFK] ${message.member.displayName}`).catch(() => {});
    }
};