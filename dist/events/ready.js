"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerReadyEvent = registerReadyEvent;
const discord_js_1 = require("discord.js");
const logs_1 = require("../handlers/logs");
function registerReadyEvent(client) {
    client.once(discord_js_1.Events.ClientReady, async (readyClient) => {
        console.log(`✅ Bot online sebagai ${readyClient.user.tag}`);
        readyClient.user.setPresence({
            activities: [
                {
                    name: "🛡️ Menjaga Community",
                    type: discord_js_1.ActivityType.Watching,
                },
            ],
            status: "online",
        });
        for (const guild of readyClient.guilds.cache.values()) {
            await (0, logs_1.ensureLogChannel)(guild);
            console.log(`🏠 Terhubung ke server: ${guild.name}`);
        }
    });
}
