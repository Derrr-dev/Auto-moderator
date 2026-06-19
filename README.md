# 🛡️ Discord Community Bot

Bot auto-moderasi lengkap untuk menjaga ketertiban server Discord kamu.

## Fitur

### 🤖 Auto Moderation
- **Anti-Phishing** — Deteksi & ban otomatis pengirim link phishing/berbahaya
- **Anti-Toxic** — Filter kata kasar dengan sistem peringatan (warn → timeout → ban)
- **Anti-Spam** — Timeout otomatis untuk spammer + hapus pesan spam

### 🔨 Slash Commands Moderasi
| Perintah | Deskripsi |
|----------|-----------|
| `/ban` | Ban seorang member |
| `/unban` | Cabut ban user |
| `/kick` | Kick member dari server |
| `/timeout` | Timeout sementara (60s ~ 1 minggu) |
| `/untimeout` | Cabut timeout |
| `/clear` | Hapus pesan (bisa filter per user) |
| `/warn` | Beri peringatan + kirim DM ke user |

### 🔒 Perlindungan Owner
- Owner server **tidak bisa** di-ban, di-kick, atau di-timeout
- Admin **tidak bisa** di-moderasi oleh moderator biasa
- Bot hanya bisa moderasi user dengan role lebih rendah

### 📋 Logs Channel
- Semua aksi moderasi otomatis ter-log di channel `mod-logs`
- Channel dibuat otomatis jika belum ada

## Setup

### 1. Clone & Install
```bash
git clone <repo-url>
cd discord-bot
npm install
```

### 2. Konfigurasi Environment
```bash
cp .env.example .env
```
Edit `.env` dan isi:
- `DISCORD_BOT_TOKEN` — Token bot dari Discord Developer Portal
- `DISCORD_CLIENT_ID` — Client ID aplikasi bot
- `OWNER_ID` — Discord User ID kamu (pemilik bot)
- `LOG_CHANNEL_NAME` — Nama channel log (default: `mod-logs`)

### 3. Setup Bot di Discord Developer Portal
1. Buka [discord.com/developers/applications](https://discord.com/developers/applications)
2. Buka bot kamu → **Bot** → Aktifkan:
   - `SERVER MEMBERS INTENT`
   - `MESSAGE CONTENT INTENT`
3. Buka **OAuth2** → **URL Generator**
4. Centang: `bot`, `applications.commands`
5. Bot Permissions: `Administrator` (atau pilih manual)
6. Copy URL dan invite bot ke servermu

### 4. Deploy Slash Commands
```bash
npm run deploy-commands
```

### 5. Jalankan Bot
```bash
# Development
npm run dev

# Production (setelah build)
npm run build
npm start
```

## Deploy ke Railway

1. Push repo ini ke GitHub
2. Buka [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Pilih repo ini
4. Tambahkan environment variables di Settings:
   - `DISCORD_BOT_TOKEN`
   - `DISCORD_CLIENT_ID`
   - `OWNER_ID`
5. Railway otomatis build & deploy!

## Konfigurasi Tambahan

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `LOG_CHANNEL_NAME` | `mod-logs` | Nama channel log |
| `MODS_ROLE_NAME` | `Moderator` | Nama role moderator |
| `MAX_WARNINGS` | `3` | Batas peringatan sebelum timeout |
| `SPAM_THRESHOLD` | `5` | Jumlah pesan sebelum dianggap spam |
| `SPAM_INTERVAL` | `5000` | Window waktu spam (ms) |
