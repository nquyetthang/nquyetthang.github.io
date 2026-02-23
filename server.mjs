import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = Number(process.env.PORT || 8080);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const ROOT = process.cwd();

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".m4a": "audio/mp4",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav"
};

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function safePath(pathname) {
  const cleaned = pathname === "/" ? "/index.html" : pathname;
  const normalized = normalize(cleaned).replace(/^\/+/, "");
  return join(ROOT, normalized);
}

async function serveStatic(pathname, res) {
  try {
    const filePath = safePath(pathname);
    const data = await readFile(filePath);
    const type = MIME_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  } catch (_error) {
    sendJson(res, 404, { error: "Not found" });
  }
}

async function handleChat(req, res) {
  if (!OPENAI_API_KEY) {
    sendJson(res, 500, { error: "Missing OPENAI_API_KEY in server environment." });
    return;
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch (_error) {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  const message = String(payload.message || "").trim();
  const searchQuery = String(payload.searchQuery || "").trim();
  const history = Array.isArray(payload.history) ? payload.history : [];

  if (!message) {
    sendJson(res, 400, { error: "Message is required." });
    return;
  }

  const historyText = history
    .slice(-10)
    .map((item) => `${item.role === "assistant" ? "Assistant" : "User"}: ${item.content || ""}`)
    .join("\n");

  const contextBlock = searchQuery ? `Search keyword from UI: ${searchQuery}` : "No search keyword provided.";

  const input = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: "You are a helpful assistant in a Vietnamese learning quiz web app. Keep replies concise, useful, and friendly. Prefer Vietnamese unless user writes in English."
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `${contextBlock}\n\nRecent conversation:\n${historyText || "(empty)"}\n\nCurrent user message:\n${message}`
        }
      ]
    }
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input,
        max_output_tokens: 400
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      sendJson(res, response.status, { error: `OpenAI API error: ${errorText}` });
      return;
    }

    const data = await response.json();
    const text = typeof data.output_text === "string" ? data.output_text.trim() : "";

    sendJson(res, 200, { reply: text || "Xin lỗi, tôi chưa tạo được câu trả lời." });
  } catch (_error) {
    sendJson(res, 500, { error: "Cannot reach OpenAI API." });
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  if (req.method === "POST" && url.pathname === "/api/chat") {
    await handleChat(req, res);
    return;
  }

  if (req.method === "GET") {
    await serveStatic(url.pathname, res);
    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
