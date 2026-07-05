const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { changeInstagramPfp, loginWithSession } = require('../utils/instagram');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('former')
        .setDescription('🔄 Change Instagram profile picture continuously')
        .addStringOption(option =>
            option.setName('session_id')
                .setDescription('Your Instagram session ID')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('times')
                .setDescription('Number of times to change (default: 50)')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(100)
        ),

    async execute(interaction) {
        const sessionId = interaction.options.getString('session_id');
        const times = interaction.options.getInteger('times') || 50;

        const imagesPath = path.join(__dirname, '../../images');
        let imageFiles = [];
        try {
            imageFiles = fs.readdirSync(imagesPath).filter(file =>
                file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')
            );
        } catch (error) {
            return interaction.reply({
                content: '❌ Images folder not found! Please add images.',
                ephemeral: true
            });
        }

        if (imageFiles.length === 0) {
            return interaction.reply({
                content: '❌ No images found in the images folder! Add some images.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0xffa500)
            .setTitle('🔄 Insta Former Username Remover')
            .setDescription(`You are about to change your Instagram profile picture **${times} times** using **${imageFiles.length} images**.`)
            .addFields(
                { name: '📸 Images Found', value: imageFiles.join('\n'), inline: false },
                { name: '🔄 Total Changes', value: `${times} times`, inline: true },
                { name: '👤 Credit', value: 'Syed Rehan (@rehuux)', inline: true },
                { name: '📌 Tool', value: 'Insta Former Username Remover', inline: true }
            )
            .setFooter({ text: 'This will take a few minutes. Do not close Discord.' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm_pfp')
                    .setLabel('✅ Start')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('cancel_pfp')
                    .setLabel('❌ Cancel')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.reply({
            embeds: [embed],
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
            if (i.customId === 'cancel_pfp') {
                await i.update({
                    content: '❌ Cancelled.',
                    embeds: [],
                    components: [],
                    ephemeral: true
                });
                return;
            }

            if (i.customId === 'confirm_pfp') {
                await i.update({
                    content: '⏳ Starting... Please wait!',
                    embeds: [],
                    components: [],
                    ephemeral: true
                });

                try {
                    const client = await loginWithSession(sessionId);

                    let successCount = 0;
                    let failCount = 0;
                    const results = [];

                    const statusEmbed = new EmbedBuilder()
                        .setColor(0x00aaff)
                        .setTitle('🔄 Insta Former Username Remover')
                        .setDescription('Progress: 0/' + times)
                        .addFields(
                            { name: '✅ Success', value: '0', inline: true },
                            { name: '❌ Failed', value: '0', inline: true },
                            { name: '📊 Total', value: `0/${times}`, inline: true },
                            { name: '👤 Credit', value: 'Syed Rehan (@rehuux)', inline: false }
                        )
                        .setTimestamp();

                    await i.editReply({
                        embeds: [statusEmbed],
                        components: [],
                        ephemeral: true
                    });

                    let imageIndex = 0;
                    for (let count = 0; count < times; count++) {
                        try {
                            const imagePath = path.join(imagesPath, imageFiles[imageIndex]);
                            await changeInstagramPfp(client, imagePath);
                            successCount++;
                            results.push(`✅ Change #${count + 1}: Success`);

                            if ((count + 1) % 5 === 0 || count === times - 1) {
                                const updatedEmbed = new EmbedBuilder()
                                    .setColor(0x00aaff)
                                    .setTitle('🔄 Insta Former Username Remover')
                                    .setDescription('Progress: ' + (count + 1) + '/' + times)
                                    .addFields(
                                        { name: '✅ Success', value: successCount + '', inline: true },
                                        { name: '❌ Failed', value: failCount + '', inline: true },
                                        { name: '📊 Total', value: `${count + 1}/${times}`, inline: true },
                                        { name: '📸 Current Image', value: imageFiles[imageIndex], inline: false },
                                        { name: '👤 Credit', value: 'Syed Rehan (@rehuux)', inline: false }
                                    )
                                    .setTimestamp();

                                await i.editReply({
                                    embeds: [updatedEmbed],
                                    components: [],
                                    ephemeral: true
                                });
                            }

                        } catch (error) {
                            failCount++;
                            results.push(`❌ Change #${count + 1}: Failed - ${error.message}`);
                        }

                        imageIndex = (imageIndex + 1) % imageFiles.length;
                    }

                    const finalEmbed = new EmbedBuilder()
                        .setColor(0x00ff00)
                        .setTitle('✅ Insta Former Username Remover — Complete!')
                        .setDescription('All changes completed successfully!')
                        .addFields(
                            { name: '✅ Success', value: successCount + '', inline: true },
                            { name: '❌ Failed', value: failCount + '', inline: true },
                            { name: '📊 Total Attempted', value: times + '', inline: true },
                            { name: '📊 Success Rate', value: ((successCount / times) * 100).toFixed(1) + '%', inline: true },
                            { name: '👤 Credit', value: 'Syed Rehan (@rehuux)', inline: true },
                            { name: '📌 Tool', value: 'Insta Former Username Remover', inline: true }
                        )
                        .setTimestamp();

                    await i.editReply({
                        embeds: [finalEmbed],
                        components: [],
                        ephemeral: true
                    });

                    const resultSummary = results.map((r, i) => `${i + 1}. ${r}`).join('\n');
                    if (results.length > 0) {
                        await interaction.followUp({
                            content: `📋 **Results Summary:**\n${resultSummary.slice(0, 1900)}`,
                            ephemeral: true
                        });
                    }

                } catch (error) {
                    console.error(error);
                    await i.editReply({
                        content: `❌ Error: ${error.message}`,
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
