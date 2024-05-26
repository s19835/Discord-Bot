import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";

config();

const client = new Client({
    intents:[GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, status => {console.log("Logged in as "+ client.user.displayName)});

client.login(process.env.TOKEN);

client.commands = new Collection();