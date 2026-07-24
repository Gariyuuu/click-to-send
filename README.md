# Click to Send

A tiny site: type a recipient, a message, and an access code, click a button, it sends that message by email and/or Discord DM.

## What's here

- `index.html` / `style.css` / `script.js` — the page.
- `api/send-email.js` — Vercel serverless function, sends one email via Gmail SMTP to whatever address you typed in.
- `api/send-discord.js` — Vercel serverless function, DMs the Discord user ID(s) you typed in (comma-separated, up to 20) via a bot.

## Setup

### 1. Install dependencies

```
npm install
```

### 2. Pick an access code

Since the deployed URL is public, every send request must include a passcode that matches `SITE_PASSCODE` on the server, or it's rejected. Pick any string only you know — this is what goes in the "Access code" field on the page.

### 3. Gmail app password

1. Turn on 2-Step Verification on the Gmail account you're sending *from*: https://myaccount.google.com/security
2. Create an App Password: https://myaccount.google.com/apppasswords (choose "Mail" / "Other").
3. Copy the 16-character password.

### 4. Discord bot (for DMing a user)

1. Go to https://discord.com/developers/applications → New Application.
2. Bot tab → Add Bot → copy the **bot token**.
3. Invite the bot to a server that every intended recipient is also a member of (OAuth2 → URL Generator → scope `bot`, no special permissions needed just to DM). A bot can only DM someone if they share a server with them.
4. In Discord, enable Developer Mode (User Settings → Advanced), then right-click each recipient → **Copy User ID**. Paste them comma-separated into the "Discord user IDs" field on the page.

### 5. Environment variables

Copy `.env.example` to `.env` and fill in your values:

```
cp .env.example .env
```

```
SITE_PASSCODE=something_only_you_know

GMAIL_USER=youraccount@gmail.com
GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx

DISCORD_BOT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
```

### 6. Run locally

```
npx vercel dev
```

Open the printed localhost URL, fill in recipient/message/access code, click a button.

### 7. Deploy

```
npx vercel
```

Then add the same env vars in the Vercel dashboard (Project → Settings → Environment Variables → Production) and redeploy, since `.env` is not uploaded automatically.

## Notes

- Each click sends the message once to each recipient listed — there's no queue, retry, or repeat-send built in.
- Both the email recipient and Discord user ID(s) are typed into the page each time. Discord is capped at 20 recipients per click.
- `.env` is gitignored — never commit real credentials.
- The access code is sent in the request body over HTTPS — good enough to keep random visitors out, not a substitute for real auth if you ever expose something more sensitive.
