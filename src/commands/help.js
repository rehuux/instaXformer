const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('📖 Show all commands and developer info'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x00aaff)
            .setTitle('📖 Insta Former Username Remover — Help')
            .setDescription('Here are all the available commands:')
            .addFields(
                {
                    name: '🔑 /get_session',
                    value: '`/get_session username:your_username password:your_password`\nGet Instagram session ID using username and password.',
                    inline: false
                },
                {
                    name: '🔄 /former',
                    value: '`/former session_id:xxxxxx times:50`\nChange Instagram profile picture continuously using session ID.',
                    inline: false
                },
                {
                    name: '🏓 /ping',
                    value: '`/ping`\nCheck bot latency and status.',
                    inline: false
                },
                {
                    name: '📖 /help',
                    value: '`/help`\nShow this help menu.',
                    inline: false
                }
            )
            .addFields(
                {
                    name: '👤 Developer',
                    value: '**Syed Rehan**\nGitHub: @rehuux',
                    inline: true
                },
                {
                    name: '📌 Tool',
                    value: 'Insta Former Username Remover',
                    inline: true
                },
                {
                    name: '📝 Version',
                    value: '1.0.0',
                    inline: true
                }
            )
            .setFooter({ text: 'Click the button below to visit developer\'s GitHub' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('👤 Developer @rehuux')
                    .setURL('https://github.com/rehuux')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setLabel('⭐ GitHub Repo')
                    .setURL('https://github.com/rehuux/instaXformer')
                    .setStyle(ButtonStyle.Link)
            );

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    }
};
