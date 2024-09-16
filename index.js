//Import node modules
const { Client, GatewayIntentBits, Partials, WebhookClient, EmbedBuilder} = require('discord.js');
const chalk = require('chalk');
require('dotenv').config();

const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));
async function error(err) {
	console.log(chalk.redBright(err));
	await sleep(200);
	process.exit(0);
}

//Establish the client
const client = new Client({
	intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	],
	partials: [
		Partials.Channel
	]
});

client.login(client.token);

client.on('ready', () => {
    console.log(chalk.hex('#a6e3a1').underline('Bot is ready!'));
    let prevStt = false;
    let status = null;
    async function check() {
        try {
            const res = await fetch(process.env.SITE_URL);
            if (res.ok == true) {
                status = true;
            } else {
                status = false;
            }
        } catch (error) {
            status = false;
        }
    }
    
    function sendNotif() {
        const sendChannel = client.channels.cache.get(process.env.SEND_CHANNEL);
        if (status == false && prevStt == true) {
            const timeStamp = Math.floor(Date.now() / 1000);
            const downEmbed = new EmbedBuilder()
                .setTitle('CHTOJ is DOWN!')
                .setDescription(`CHTOJ is DOWN!\n\n from <t:${timeStamp}:R>`)
                .setColor('#f38ba8')
                .setTimestamp();
            sendChannel.send({embeds: [downEmbed], content: `<@&1284871505632821269>`});
            prevStt = false;
        } else if (status == true && prevStt == false) {
            const timeStamp = Math.floor(Date.now() / 1000);
            const restoredEmbed = new EmbedBuilder()
                .setTitle('CHTOJ is RESTORED!')
                .setDescription(`CHTOJ is UP!\n\n from <t:${timeStamp}:R>`)
                .setColor('#a6e3a1')
                .setTimestamp();
            sendChannel.send({embeds: [restoredEmbed], content: `<@&1284871505632821269>`});
            prevStt = true;
        }
    }
    setInterval(check, 30000);
    setInterval(sendNotif, 30000);
});