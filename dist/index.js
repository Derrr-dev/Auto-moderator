"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const ready_1 = require("./events/ready");
const messageCreate_1 = require("./events/messageCreate");
const interactionCreate_1 = require("./events/interactionCreate");
const guildCreate_1 = require("./events/guildCreate");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildBans,
        discord_js_1.GatewayIntentBits.GuildModeration,
    ],
    partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel, discord_js_1.Partials.GuildMember],
});
(0, ready_1.registerReadyEvent)(client);
(0, messageCreate_1.registerMessageCreateEvent)(client);
(0, interactionCreate_1.registerInteractionCreateEvent)(client);
(0, guildCreate_1.registerGuildCreateEvent)(client);
client.on("error", (err) => {
    console.error("[Discord Client Error]", err);
});
process.on("unhandledRejection", (err) => {
    console.error("[Unhandled Rejection]", err);
});
process.on("uncaughtException", (err) => {
    console.error("[Uncaught Exception]", err);
    process.exit(1);
});
console.log("🚀 Menghubungkan bot ke Discord...");
client.login(config_1.config.token).catch((err) => {
    console.error("❌ Gagal login:", err);
    process.exit(1);
});
