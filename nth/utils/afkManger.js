const { Collection, EmbedBuilder } = require('discord.js');

const afkMap = new Collection();

module.exports = {
    setAfk: (userId, reason) => {
        afkMap.set(userId, {
            reason: reason,
            time: Date.now()
        });
    },

    removeAfk: (userId) => {
        afkMap.delete(userId);
    },

    isAfk: (userId) => {
        return afkMap.has(userId);
    },

    getAfkInfo: (userId) => {
        return afkMap.get(userId);
    },

    handleMessage: async (message) => {
        if (module.exports.isAfk(message.author.id)) {
            module.exports.removeAfk(message.author.id);
            await message.member.setNickname(message.member.displayName.replace(/^\[AFK\]\s*/i, '')).catch(() => {});
            await message.reply("Welcome back! I've removed your AFK status.");
        }

        if (message.mentions.users.size > 0) {
            message.mentions.users.forEach(async (mentionedUser) => {
                if (module.exports.isAfk(mentionedUser.id)) {
                    const afkData = module.exports.getAfkInfo(mentionedUser.id);
                    const timeElapsed = Date.now() - afkData.time;
                    const timeInMinutes = Math.floor(timeElapsed / 60000);

                    const afkMentionEmbed = new EmbedBuilder()
                        .setColor('#FFCC00')
                        .setTitle(`${mentionedUser.username} is AFK`)
                        .setDescription(`${mentionedUser} has been AFK for ${timeInMinutes} minute(s).`)
                        .addFields({ name: 'Reason', value: afkData.reason })
                        .setTimestamp();

                    await message.channel.send({ embeds: [afkMentionEmbed] });
                }
            });
        }
    }
};