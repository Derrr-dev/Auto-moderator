"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const permissions_1 = require("../../utils/permissions");
const embed_1 = require("../../utils/embed");
const logs_1 = require("../../handlers/logs");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("warn")
    .setDescription("Beri peringatan kepada member")
    .addUserOption((o) => o.setName("target").setDescription("User yang akan diberi peringatan").setRequired(true))
    .addStringOption((o) => o.setName("alasan").setDescription("Alasan peringatan").setRequired(true))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ModerateMembers);
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
        await interaction.reply({ content: "❌ User ini tidak bisa diberi peringatan (owner/admin dilindungi).", ephemeral: true });
        return;
    }
    const alasan = interaction.options.getString("alasan", true);
    try {
        await target.user.send({
            embeds: [
                (0, embed_1.buildModEmbed)({
                    action: "⚠️ PERINGATAN",
                    target: `${target.user.tag}`,
                    moderator: `${moderator.user.tag}`,
                    reason: alasan,
                    color: "#FFA500",
                }),
            ],
        });
    }
    catch {
        // DM mungkin dinonaktifkan oleh user
    }
    const embed = (0, embed_1.buildModEmbed)({
        action: "PERINGATAN",
        target: `${target.user.tag} (${target.id})`,
        moderator: `${moderator.user.tag}`,
        reason: alasan,
        color: "#FFA500",
    });
    await (0, logs_1.sendLog)(interaction.guild, embed);
    await interaction.reply({ embeds: [embed] });
}
