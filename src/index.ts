import { Client, GatewayIntentBits, Partials } from "discord.js";
import { config } from "./config";
import { registerReadyEvent } from "./events/ready";
import { registerMessageCreateEvent } from "./events/messageCreate";
import { registerInteractionCreateEvent } from "./events/interactionCreate";
import { registerGuildCreateEvent } from "./events/guildCreate";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
});

registerReadyEvent(client);
registerMessageCreateEvent(client);
registerInteractionCreateEvent(client);
registerGuildCreateEvent(client);

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
client.login(config.token).catch((err) => {
  console.error("❌ Gagal login:", err);
  process.exit(1);
});
