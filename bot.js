import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";

config();

const client = new Client({
    intents:[GatewayIntentBits.Guilds],
});