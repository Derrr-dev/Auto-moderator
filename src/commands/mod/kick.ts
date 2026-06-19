import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  GuildMember,
} from "discord.js";
import { isProtected, isModerator } from "../../utils/permissions";
import { buildModEmbed } from "../../utils/embed";
import { sendLog } from "../../handlers/logs";

export const data = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kick seorang member dari server")
  .addUserOption((o) =>
    o.setName("target").setDescription("User yang akan di-kick").setRequired(true)
  )
  .addStringOption((o) =>
    o.setName("alasan").setDescription("Alasan kick").setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  if (!interaction.guild || !interaction.member) {
    await interaction.reply({ content: "Perintah ini hanya bisa digunakan di server.", ephemeral: true });
    return;
  }

  const moderator = interaction.member as GuildMember;
  if (!isModerator(moderator)) {
    await interaction.reply({ content: "❌ Kamu tidak punya izin untuk melakukan ini.", ephemeral: true });
    return;
  }

  const target = interaction.options.getMember("target") as GuildMember | null;
  if (!target) {
    await interaction.reply({ content: "❌ User tidak ditemukan di server.", ephemeral: true });
    return;
  }

  if (isProtected(target)) {
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

  const embed = buildModEmbed({
    action: "KICK",
    target: `${target.user.tag} (${target.id})`,
    moderator: `${moderator.user.tag}`,
    reason: alasan,
    color: "#FF8800",
  });

  await sendLog(interaction.guild, embed);
  await interaction.reply({ embeds: [embed] });
}
