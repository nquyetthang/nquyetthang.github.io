export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    const isChatPath = url.pathname === "/api/chat" || url.pathname === "/";
    if (request.method !== "POST" || !isChatPath) {
      return json({ error: "Not found" }, 404);
    }

    if (!env.OPENAI_API_KEY) {
      return json({ error: "Missing OPENAI_API_KEY in worker secrets." }, 500);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON body." }, 400);
    }

    const message = String(payload.message || "").trim();
    const searchQuery = String(payload.searchQuery || "").trim();
    const history = Array.isArray(payload.history) ? payload.history : [];

    if (!message) {
      return json({ error: "Message is required." }, 400);
    }

    const historyText = history
      .slice(-10)
      .map((item) => `${item.role === "assistant" ? "Assistant" : "User"}: ${item.content || ""}`)
      .join("\n");

    const contextBlock = searchQuery ? `Search keyword from UI: ${searchQuery}` : "No search keyword provided.";
    const model = env.OPENAI_MODEL || "gpt-4o-mini";

    try {
      const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model,
          input: [
            {
              role: "system",
              content: [
                {
                  type: "input_text",
                  text: "You are a helpful assistant in a Vietnamese learning quiz web app. Keep replies concise and useful. Prefer Vietnamese unless user writes in English."
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
          ],
          max_output_tokens: 400
        })
      });

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        return json({ error: `OpenAI API error: ${errorText}` }, openaiResponse.status);
      }

      const data = await openaiResponse.json();
      const reply = extractReplyText(data);
      return json({ reply: reply || "Xin lỗi, tôi chưa tạo được câu trả lời." }, 200);
    } catch {
      return json({ error: "Cannot reach OpenAI API." }, 500);
    }
  }
};

function extractReplyText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  if (Array.isArray(data?.output)) {
    const chunks = [];
    for (const item of data.output) {
      const content = Array.isArray(item?.content) ? item.content : [];
      for (const block of content) {
        if (typeof block?.text === "string" && block.text.trim()) {
          chunks.push(block.text.trim());
        }
      }
    }
    if (chunks.length > 0) {
      return chunks.join("\n");
    }
  }

  if (typeof data?.response?.output_text === "string" && data.response.output_text.trim()) {
    return data.response.output_text.trim();
  }

  return "";
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders()
    }
  });
}
