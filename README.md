# nquyetthang.github.io

Static quiz app (HTML/CSS/JS) with Vietnamese text-to-speech.

## GitHub Pages setup (no local backend run)

GitHub Pages is static, so AI chat must call an external API endpoint.

### 1) Deploy serverless API (Cloudflare Worker)

Use `/Users/andythang/nquyetthang.github.io/cloudflare-worker.js`.

Commands:

```bash
npm create cloudflare@latest quiz-ai-worker
cd quiz-ai-worker
```

Replace generated worker file with content from `cloudflare-worker.js`, then:

```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put OPENAI_MODEL
npx wrangler deploy
```

After deploy, you will get a URL like:
`https://quiz-ai-worker.<subdomain>.workers.dev`

Your chat endpoint is:
`https://quiz-ai-worker.<subdomain>.workers.dev/api/chat`

### 2) Configure frontend endpoint

Edit `/Users/andythang/nquyetthang.github.io/config.js`:

```js
window.APP_CONFIG = {
  CHAT_API_URL: "https://quiz-ai-worker.<subdomain>.workers.dev/api/chat"
};
```

### 3) Push to GitHub Pages

Commit and push this repo. Your Pages site will call the worker directly, no local `node` process needed.
