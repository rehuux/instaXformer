const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const http = require('http');
require('dotenv').config();

// ============== HTTP SERVER FOR RENDER ==============
const server = http.createServer((req, res) => {
    if (req.url === '/health' || req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            bot: 'Insta Former Username Remover',
            uptime: process.uptime()
        }));
    } else {
        res.writeHead(404);
        res.end();
    }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ HTTP server running on port ${PORT}`);
});

server.on('error', (error) => {
    console.error('HTTP Server error:', error);
});

console.log('========================================');
console.log('   🔄 Insta Former Username Remover');
console.log('   Credit: Syed Rehan');
console.log('   Dev: @rehuux (GitHub)');
console.log('========================================');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded: ${command.data.name}`);
    }
}

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} is online!`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);
    console.log(`🔧 Tool: Insta Former Username Remover`);
    console.log(`👤 Credit: Syed Rehan (@rehuux)`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: '❌ Something went wrong!',
            ephemeral: true
        });
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Shutting down...');
    client.destroy();
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down...');
    client.destroy();
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

client.login(process.env.DISCORD_TOKEN);
