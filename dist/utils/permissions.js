"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwner = isOwner;
exports.isModerator = isModerator;
exports.isProtected = isProtected;
exports.canModerate = canModerate;
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
function isOwner(member) {
    return (member.id === member.guild.ownerId ||
        member.id === config_1.config.ownerId);
}
function isModerator(member) {
    return (member.permissions.has(discord_js_1.PermissionFlagsBits.ModerateMembers) ||
        member.roles.cache.some((r) => r.name === config_1.config.modsRoleName));
}
function isProtected(member) {
    if (isOwner(member))
        return true;
    if (member.permissions.has(discord_js_1.PermissionFlagsBits.Administrator))
        return true;
    return false;
}
function canModerate(moderator, target) {
    if (isProtected(target))
        return false;
    if (!isModerator(moderator))
        return false;
    if (moderator.roles.highest.position <= target.roles.highest.position)
        return false;
    return true;
}
