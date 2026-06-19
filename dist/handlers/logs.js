"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLog = sendLog;
exports.ensureLogChannel = ensureLogChannel;
const config_1 = require("../config");
async function sendLog(guild, embed) {
    try {
        const logChannel = guild.channels.cache.find((c) => c.name === config_1.config.logChannelName && c.isTextBased());
        if (!logChannel) {
            console.warn(`[Logs] Channel "${config_1.config.logChannelName}" tidak ditemukan di ${guild.name}`);
            return;
        }
        await logChannel.send({ embeds: [embed] });
    }
    catch (err) {
        console.error("[Logs] Gagal kirim log:", err);
    }
}
async function ensureLogChannel(guild) {
    try {
        const existing = guild.channels.cache.find((c) => c.name === config_1.config.logChannelName && c.isTextBased());
        if (existing)
            return existing;
        const created = await guild.channels.create({
            name: config_1.config.logChannelName,
            reason: "AutoMod log channel dibuat otomatis oleh bot",
        });
        console.log(`[Logs] Channel "${config_1.config.logChannelName}" dibuat di ${guild.name}`);
        return created;
    }
    catch (err) {
        console.error("[Logs] Gagal buat log channel:", err);
        return null;
    }
}
