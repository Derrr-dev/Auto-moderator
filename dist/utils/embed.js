"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEmbed = buildEmbed;
exports.buildModEmbed = buildModEmbed;
exports.buildAutomodEmbed = buildAutomodEmbed;
const discord_js_1 = require("discord.js");
function buildEmbed(title, description, color = "#FF0000") {
    return new discord_js_1.EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}
function buildModEmbed(options) {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(`🔨 ${options.action}`)
        .setColor(options.color ?? "#FF4444")
        .setTimestamp()
        .addFields({ name: "👤 Target", value: options.target, inline: true }, { name: "🛡️ Moderator", value: options.moderator, inline: true }, { name: "📋 Alasan", value: options.reason });
    if (options.duration) {
        embed.addFields({ name: "⏱️ Durasi", value: options.duration, inline: true });
    }
    return embed;
}
function buildAutomodEmbed(options) {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(`🤖 AutoMod — ${options.action}`)
        .setColor(options.color ?? "#FF6600")
        .setTimestamp()
        .addFields({ name: "👤 User", value: options.target, inline: true }, { name: "📋 Alasan", value: options.reason });
    if (options.details) {
        embed.addFields({ name: "📝 Detail", value: options.details });
    }
    return embed;
}
