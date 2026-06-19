"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const permissions_1 = require("../../utils/permissions");
const embed_1 = require("../../utils/embed");
const logs_1 = require("../../handlers/logs");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("unban")
    .setDescription("Cabut ban seorang user")
    .addStringOption((o) => o.setName("userid").setDescription("ID Discord user yang akan di-unban").setRequired(true))
    .addStringOption((o) => o.setName("alasan").setDescription("Alasan unban").setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers);
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
    const userId = interaction.options.getString("userid", true);
    const alasan = interaction.options.getString("alasan") ?? "Tidak ada alasan diberikan";
    try {
        const banInfo = await interaction.guild.bans.fetch(userId);
        await interaction.guild.members.unban(userId, `${moderator.user.tag}: ${alasan}`);
        const embed = (0, embed_1.buildModEmbed)({
            action: "UNBAN",
            target: `${banInfo.user.tag} (${userId})`,
            moderator: `${moderator.user.tag}`,
            reason: alasan,
            color: "#00CC44",
        });
        await (0, logs_1.sendLog)(interaction.guild, embed);
        await interaction.reply({ embeds: [embed] });
    }
    catch {
        await interaction.reply({ content: "❌ User tidak ditemukan dalam daftar ban atau ID tidak valid.", ephemeral: true });
    }
}
