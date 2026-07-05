const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getSessionIdFromLogin } = require('../utils/instagram');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get_session')
        .setDescription('🔑 Get Instagram session ID using username and password')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Your Instagram username')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('password')
                .setDescription('Your Instagram password')
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.reply({
            content: '⏳ Logging in... Please wait!',
            ephemeral: true
        });

        try {
            const username = interaction.options.getString('username');
            const password = interaction.options.getString('password');

            const result = await getSessionIdFromLogin(username, password);

            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle('✅ Session ID Generated!')
                .setDescription(`Successfully logged in as **${result.username}**`)
                .addFields(
                    { name: '🔑 Session ID', value: `\`${result.sessionid}\``, inline: false },
                    { name: '📌 Tool', value: 'Insta Former Username Remover', inline: true },
                    { name: '👤 Credit', value: 'Syed Rehan (@rehuux)', inline: true }
                )
                .setFooter({ text: 'Copy this session ID and use it with /former command' })
                .setTimestamp();

            await interaction.editReply({
                content: null,
                embeds: [embed]
            });

            // Also send as plain text for easy copying
            await interaction.followUp({
                content: `🔑 **Your Session ID:**\n\`${result.sessionid}\``,
                ephemeral: true
            });

        } catch (error) {
            await interaction.editReply({
                content: `❌ Error: ${error.message}`,
                embeds: [],
                ephemeral: true
            });
        }
    }
};
