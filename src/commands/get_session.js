const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
        const username = interaction.options.getString('username');
        const password = interaction.options.getString('password');

        // Send ephemeral confirmation with warning
        const warningEmbed = new EmbedBuilder()
            .setColor(0xffa500)
            .setTitle('⚠️ Important Security Notice')
            .setDescription(`You are about to log in to Instagram using your credentials.`)
            .addFields(
                { name: '🔐 Privacy', value: 'Your credentials are used only to generate a session ID. They are **not stored anywhere**.', inline: false },
                { name: '📌 Tool', value: 'Insta Former Username Remover', inline: true },
                { name: '👤 Credit', value: 'Syed Rehan (@rehuux)', inline: true }
            )
            .setFooter({ text: 'Click Continue to proceed. This may take a few seconds.' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('continue_login')
                    .setLabel('✅ Continue')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('cancel_login')
                    .setLabel('❌ Cancel')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.reply({
            embeds: [warningEmbed],
            components: [row],
            ephemeral: true
        });

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 30000,
            max: 1
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'cancel_login') {
                await i.update({
                    content: '❌ Cancelled.',
                    embeds: [],
                    components: [],
                    ephemeral: true
                });
                return;
            }

            if (i.customId === 'continue_login') {
                await i.update({
                    content: '⏳ Logging in... Please wait!',
                    embeds: [],
                    components: [],
                    ephemeral: true
                });

                try {
                    const result = await getSessionIdFromLogin(username, password);

                    const successEmbed = new EmbedBuilder()
                        .setColor(0x00ff00)
                        .setTitle('✅ Session ID Generated!')
                        .setDescription(`Successfully logged in as **${username}**`)
                        .addFields(
                            { name: '🔑 Session ID', value: `\`${result.sessionid}\``, inline: false },
                            { name: '📌 Tool', value: 'Insta Former Username Remover', inline: true },
                            { name: '👤 Credit', value: 'Syed Rehan (@rehuux)', inline: true }
                        )
                        .setFooter({ text: 'Copy this session ID and use it with /former command' })
                        .setTimestamp();

                    await i.editReply({
                        content: null,
                        embeds: [successEmbed],
                        components: [],
                        ephemeral: true
                    });

                    // Also send session ID as a separate message for easy copying
                    await interaction.followUp({
                        content: `🔑 **Your Session ID:**\n\`${result.sessionid}\`\n\nUse it with: \`/former session_id:${result.sessionid} times:50\``,
                        ephemeral: true
                    });

                } catch (error) {
                    console.error(error);
                    const errorEmbed = new EmbedBuilder()
                        .setColor(0xff0000)
                        .setTitle('❌ Login Failed')
                        .setDescription(`Error: ${error.message}`)
                        .addFields(
                            { name: '📌 Tool', value: 'Insta Former Username Remover', inline: true },
                            { name: '👤 Credit', value: 'Syed Rehan (@rehuux)', inline: true }
                        )
                        .setTimestamp();

                    await i.editReply({
                        content: null,
                        embeds: [errorEmbed],
                        components: [],
                        ephemeral: true
                    });
                }
            }
        });

        collector.on('end', (collected) => {
            if (collected.size === 0) {
                interaction.editReply({
                    content: '⏰ Timed out. Please try again.',
                    components: [],
                    ephemeral: true
                });
            }
        });
    }
};
