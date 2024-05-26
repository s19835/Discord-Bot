import { SlashCommandBuilder } from "discord.js";

export const data =  new SlashCommandBuilder().setName("begin").setDescription("Confirm the interaction of the bot with user");

export async function execute(interaction) {
    await interaction.reply("Hey!");
};