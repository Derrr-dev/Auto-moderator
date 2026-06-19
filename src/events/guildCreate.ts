import { Client, Events, Guild } from "discord.js";
import { ensureLogChannel } from "../handlers/logs";

export function registerGuildCreateEvent(client: Client): void {
  client.on(Events.GuildCreate, async (guild: Guild) => {
    console.log(`➕ Bot ditambahkan ke server: ${guild.name}`);
    await ensureLogChannel(guild);
  });
}
