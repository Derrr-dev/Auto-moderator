"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerInteractionCreateEvent = registerInteractionCreateEvent;
const discord_js_1 = require("discord.js");
const commands_1 = require("../commands");
function registerInteractionCreateEvent(client) {
    client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand())
            return;
        const command = commands_1.commands.get(interaction.commandName);
        if (!command) {
            await interaction.reply({
                content: "❌ Perintah tidak ditemukan.",
                ephemeral: true,
            });
            return;
        }
        try {
            await command.execute(interaction);
        }
        catch (err) {
            console.error(`[Command Error] /${interaction.commandName}:`, err);
            const errorMsg = "❌ Terjadi kesalahan saat menjalankan perintah.";
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMsg, ephemeral: true });
            }
            else {
                await interaction.reply({ content: errorMsg, ephemeral: true });
            }
        }
    });
}
