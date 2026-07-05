const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('🏓 Check bot latency'),

    async execute(interaction) {
        const sent = await interaction.reply({ content: '🏓 Pinging...', fetchReply: true });

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('🏓 Pong!')
            .addFields(
                { name: '📡 Latency', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
                { name: '❤️ WebSocket', value: `${interaction.client.ws.ping}ms`, inline: true },
                { name: '📌 Tool', value: 'Insta Former Username Remover', inline: true },
                { name: '👤 Credit', value: 'Syed Rehan (@rehuux)', inline: true }
            )
            .setTimestamp();

        await interaction.editReply({
            content: null,
            embeds: [embed]
        });
    }
};
