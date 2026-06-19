"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const permissions_1 = require("../../utils/permissions");
const embed_1 = require("../../utils/embed");
const logs_1 = require("../../handlers/logs");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick seorang member dari server")
    .addUserOption((o) => o.setName("target").setDescription("User yang akan di-kick").setRequired(true))
    .addStringOption((o) => o.setName("alasan").setDescription("Alasan kick").setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.KickMembers);
async function execute(interaction) {
    if (!interaction.guild || !interaction.member) {
        await interaction.reply({ content: "Perintah ini hanya bisa digunakan di server.", ephemeral: true });
        return;
    }
    const moderator = interaction.member;
    if (!(0, permissions_1.isModerator)(moderator)) {
        await interaction.reply({ content: "❌ Kamu tidak punya izin untuk melakukan ini.", ephemeral: true });
        return;
    }
    const target = interaction.options.getMember("target");
    if (!target) {
        await interaction.reply({ content: "❌ User tidak ditemukan di server.", ephemeral: true });
        return;
    }
    if ((0, permissions_1.isProtected)(target)) {
        await interaction.reply({ content: "❌ User ini tidak bisa di-kick (owner/admin dilindungi).", ephemeral: true });
        return;
    }
    if (!target.kickable) {
        await interaction.reply({ content: "❌ Bot tidak punya izin untuk kick user ini.", ephemeral: true });
        return;
    }
    if (moderator.roles.highest.position <= target.roles.highest.position) {
        await interaction.reply({ content: "❌ Kamu tidak bisa kick user dengan role lebih tinggi atau setara.", ephemeral: true });
        return;
    }
    const alasan = interaction.options.getString("alasan") ?? "Tidak ada alasan diberikan";
    await target.kick(`${moderator.user.tag}: ${alasan}`);
    const embed = (0, embed_1.buildModEmbed)({
        action: "KICK",
        target: `${target.user.tag} (${target.id})`,
        moderator: `${moderator.user.tag}`,
        reason: alasan,
        color: "#FF8800",
    });
    await (0, logs_1.sendLog)(interaction.guild, embed);
    await interaction.reply({ embeds: [embed] });
}
