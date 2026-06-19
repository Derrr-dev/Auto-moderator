"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGuildCreateEvent = registerGuildCreateEvent;
const discord_js_1 = require("discord.js");
const logs_1 = require("../handlers/logs");
function registerGuildCreateEvent(client) {
    client.on(discord_js_1.Events.GuildCreate, async (guild) => {
        console.log(`➕ Bot ditambahkan ke server: ${guild.name}`);
        await (0, logs_1.ensureLogChannel)(guild);
    });
}
