"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAutomod = handleAutomod;
const config_1 = require("../config");
const logs_1 = require("./logs");
const embed_1 = require("../utils/embed");
const permissions_1 = require("../utils/permissions");
const spamTracker = new Map();
const warnTracker = new Map();
const PHISHING_DOMAINS = [
    "discord-nitro.xyz", "discordgift.site", "discordnitro.gift",
    "steamgift.win", "free-nitro.ru", "discord.gift.com",
    "nitro-discord.com", "discord-free.gift", "discordapp.io",
    "discocrd.com", "discordl.com", "discordd.com",
    "free-steam.xyz", "steamcommunity.ru", "steamskins.org",
    "csgofast.xyz", "skinswap.net", "tradeoffers.ru",
    "bit.ly", "tinyurl.com", "rebrand.ly",
];
const TOXIC_WORDS = [
    "anjing", "bangsat", "babi", "kontol", "memek", "ngentot",
    "bajingan", "tolol", "goblok", "idiot", "fuck", "shit",
    "bitch", "asshole", "nigger", "bastard", "cunt",
    "pukimak", "kimak", "celaka", "setan", "iblis",
];
const SPAM_PATTERNS = [
    /(.)\1{9,}/,
    /^.{1,3}$/,
];
function containsPhishingLink(content) {
    const urlRegex = /https?:\/\/([^\s/]+)/gi;
    let match;
    while ((match = urlRegex.exec(content)) !== null) {
        const domain = match[1].toLowerCase();
        for (const phishing of PHISHING_DOMAINS) {
            if (domain.includes(phishing))
                return domain;
        }
    }
    return null;
}
function containsToxicWord(content) {
    const lower = content.toLowerCase();
    for (const word of TOXIC_WORDS) {
        if (lower.includes(word))
            return word;
    }
    return null;
}
function isSpam(content) {
    for (const pattern of SPAM_PATTERNS) {
        if (pattern.test(content))
            return true;
    }
    return false;
}
async function applyTimeout(member, durationMs, reason) {
    try {
        if (!member.moderatable)
            return false;
        await member.timeout(durationMs, reason);
        return true;
    }
    catch {
        return false;
    }
}
async function applyBan(member, reason) {
    try {
        if (!member.bannable)
            return false;
        await member.ban({ reason, deleteMessageSeconds: 86400 });
        return true;
    }
    catch {
        return false;
    }
}
function addWarning(userId) {
    const current = warnTracker.get(userId) ?? 0;
    warnTracker.set(userId, current + 1);
    return current + 1;
}
async function handleAutomod(message) {
    if (!message.guild || !message.member)
        return;
    if (message.author.bot)
        return;
    if ((0, permissions_1.isProtected)(message.member))
        return;
    const member = message.member;
    const userId = message.author.id;
    const content = message.content;
    const phishingDomain = containsPhishingLink(content);
    if (phishingDomain) {
        await message.delete().catch(() => null);
        await applyBan(member, `AutoMod: Mengirim link phishing (${phishingDomain})`);
        await (0, logs_1.sendLog)(message.guild, (0, embed_1.buildAutomodEmbed)({
            action: "BAN — Link Phishing",
            target: `${message.author.tag} (${userId})`,
            reason: "Mengirim link phishing/berbahaya",
            details: `Domain: \`${phishingDomain}\`\nChannel: ${message.channel}`,
            color: "#CC0000",
        }));
        return;
    }
    const toxicWord = containsToxicWord(content);
    if (toxicWord) {
        await message.delete().catch(() => null);
        const warnings = addWarning(userId);
        if (warnings >= config_1.config.maxWarnings) {
            await applyTimeout(member, 60 * 60 * 1000, "AutoMod: Terlalu banyak kata toxic");
            warnTracker.set(userId, 0);
            await (0, logs_1.sendLog)(message.guild, (0, embed_1.buildAutomodEmbed)({
                action: `TIMEOUT 1 Jam — Kata Toxic (${warnings}x peringatan)`,
                target: `${message.author.tag} (${userId})`,
                reason: `Peringatan ke-${warnings}: Kata kasar/toxic`,
                details: `Kata terdeteksi: \`${toxicWord}\`\nChannel: ${message.channel}`,
                color: "#FF6600",
            }));
        }
        else if (message.channel.isTextBased() && !message.channel.isDMBased()) {
            await message.channel
                .send({
                content: `⚠️ <@${userId}>, peringatan ke-${warnings}/${config_1.config.maxWarnings}: Kata kasar tidak diizinkan! Pelanggaran lanjut akan berujung timeout.`,
            })
                .then((m) => setTimeout(() => m.delete().catch(() => null), 8000));
            await (0, logs_1.sendLog)(message.guild, (0, embed_1.buildAutomodEmbed)({
                action: `PERINGATAN ${warnings}/${config_1.config.maxWarnings} — Kata Toxic`,
                target: `${message.author.tag} (${userId})`,
                reason: "Menggunakan kata kasar/toxic",
                details: `Kata terdeteksi: \`${toxicWord}\`\nChannel: ${message.channel}`,
                color: "#FFA500",
            }));
        }
        return;
    }
    const now = Date.now();
    const tracker = spamTracker.get(userId) ?? { count: 0, firstMessage: now, warned: false };
    if (now - tracker.firstMessage > config_1.config.spamInterval) {
        tracker.count = 1;
        tracker.firstMessage = now;
        tracker.warned = false;
    }
    else {
        tracker.count++;
    }
    spamTracker.set(userId, tracker);
    const spamContent = isSpam(content);
    if (tracker.count >= config_1.config.spamThreshold || spamContent) {
        if (message.channel.isTextBased() && !message.channel.isDMBased()) {
            const msgs = await message.channel.messages.fetch({ limit: 20 }).catch(() => null);
            if (msgs) {
                const userMsgs = msgs.filter((m) => m.author.id === userId);
                await message.channel.bulkDelete(userMsgs, true).catch(() => null);
            }
        }
        await applyTimeout(member, 5 * 60 * 1000, "AutoMod: Spam terdeteksi");
        spamTracker.set(userId, { count: 0, firstMessage: now, warned: false });
        await (0, logs_1.sendLog)(message.guild, (0, embed_1.buildAutomodEmbed)({
            action: "TIMEOUT 5 Menit — Spam",
            target: `${message.author.tag} (${userId})`,
            reason: spamContent ? "Pesan spam terdeteksi" : `Mengirim ${tracker.count} pesan dalam ${config_1.config.spamInterval / 1000} detik`,
            details: `Channel: ${message.channel}`,
            color: "#FF6600",
        }));
        return;
    }
}
