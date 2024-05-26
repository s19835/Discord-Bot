import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

config();

const client = new Client({
    intents:[GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, status => {console.log("Logged in as "+ client.user.displayName)});

client.login(process.env.TOKEN);

client.commands = new Collection();

//Command Handler, instead of using if/else if in a higher level project to reduce the pain command handler is the simple one, I intend to use this as template for the futur projects.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
        const command = await import(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
//some codes are differ from the documentation because we are using ES module instead of commonJS

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});