"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMessageCreateEvent = registerMessageCreateEvent;
const discord_js_1 = require("discord.js");
const automod_1 = require("../handlers/automod");
function registerMessageCreateEvent(client) {
    client.on(discord_js_1.Events.MessageCreate, async (message) => {
        if (message.author.bot)
            return;
        if (!message.guild)
            return;
        await (0, automod_1.handleAutomod)(message);
    });
}
