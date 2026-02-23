const quizQuestions = [
  {
    question: "Yếu tố quan trọng nhất giúp bài văn nghị luận xã hội thuyết phục người đọc là gì?",
    options: [
      { label: "A", text: "Sử dụng nhiều từ ngữ hoa mỹ" },
      { label: "B", text: "Đưa ra luận điểm rõ ràng, lập luận chặt chẽ và dẫn chứng thuyết phục" },
      { label: "C", text: "Kể nhiều câu chuyện thú vị" },
      { label: "D", text: "Viết thật dài và sử dụng từ ngữ khó hiểu" }
    ],
    answer: "B"
  },
  {
    question: "Khi viết đoạn văn nghị luận xã hội, vì sao cần có dẫn chứng thực tế?",
    options: [
      { label: "A", text: "Để bài viết dài hơn" },
      { label: "B", text: "Để làm cho bài viết thêm sinh động và thuyết phục" },
      { label: "C", text: "Để gây ấn tượng với người đọc" },
      { label: "D", text: "Không nhất thiết phải có dẫn chứng" }
    ],
    answer: "B"
  },
  {
    question: "Văn bản nghị luận xã hội nhằm mục đích gì?",
    options: [
      { label: "A", text: "Giải thích các vấn đề khoa học" },
      { label: "B", text: "Bàn luận, đánh giá một vấn đề trong đời sống xã hội" },
      { label: "C", text: "Kể lại các sự kiện đã xảy ra" },
      { label: "D", text: "Giới thiệu một tác phẩm văn học" }
    ],
    answer: "B"
  },
  {
    question: "Luận điểm trong bài nghị luận xã hội cần phải đảm bảo điều gì?",
    options: [
      { label: "A", text: "Ngắn gọn, rõ ràng, có tính thuyết phục" },
      { label: "B", text: "Được trình bày dưới dạng câu chuyện dài" },
      { label: "C", text: "Không cần nhất quán, có thể thay đổi tùy ý" },
      { label: "D", text: "Chỉ cần nêu lên mà không cần giải thích hay chứng minh" }
    ],
    answer: "A"
  },
  {
    question: "Dẫn chứng trong văn bản nghị luận xã hội cần đảm bảo yêu cầu nào sau đây?",
    options: [
      { label: "A", text: "Phải là những câu chuyện hư cấu để làm nổi bật vấn đề" },
      { label: "B", text: "Càng nhiều càng tốt, không quan trọng tính xác thực" },
      { label: "C", text: "Cụ thể, chân thực, có tính tiêu biểu và thuyết phục" },
      { label: "D", text: "Không cần dẫn chứng, chỉ cần lập luận là đủ" }
    ],
    answer: "C"
  }
];

// Replace with your own voice file path, for example: "./audio/my-voice.mp3"
const END_AUDIO_SRC = "";
const CHAT_API_URL = window.APP_CONFIG?.CHAT_API_URL || "";

const counterEl = document.getElementById("counter");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const answerEl = document.getElementById("answer");

const prevBtn = document.getElementById("prevBtn");
const replayBtn = document.getElementById("replayBtn");
const toggleAnswerBtn = document.getElementById("toggleAnswerBtn");
const nextBtn = document.getElementById("nextBtn");
const realAiBtn = document.getElementById("realAiBtn");
const aiPanel = document.getElementById("aiPanel");
const aiSearchInput = document.getElementById("aiSearchInput");
const aiMessages = document.getElementById("aiMessages");
const aiUserInput = document.getElementById("aiUserInput");
const aiSendBtn = document.getElementById("aiSendBtn");

let index = 0;
let showAnswer = false;
const endAudio = new Audio(END_AUDIO_SRC);
const chatHistory = [];
let isSending = false;

function resolveChatApiUrl(rawUrl) {
  const base = String(rawUrl || "").trim();
  if (!base) return "";
  return base.endsWith("/api/chat") ? base : `${base.replace(/\/+$/, "")}/api/chat`;
}

function buildSpeechText(question) {
  const optionsText = question.options
    .map((option) => `${option.label}. ${option.text}`)
    .join(". ");
  return `${question.question}. ${optionsText}`;
}

function speakQuestion(question) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(buildSpeechText(question));
  utterance.lang = "vi-VN";
  utterance.rate = 1;

  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("vi"));
  if (viVoice) utterance.voice = viVoice;

  window.speechSynthesis.speak(utterance);
}

async function playEndAudio() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  endAudio.currentTime = 0;
  try {
    await endAudio.play();
  } catch (_error) {
    alert("Không thể phát file giọng nói. Hãy kiểm tra END_AUDIO_SRC trong script.js.");
  }
}

function render() {
  const currentQuestion = quizQuestions[index];

  counterEl.textContent = `Câu ${index + 1}/${quizQuestions.length}`;
  questionEl.textContent = currentQuestion.question;

  optionsEl.innerHTML = "";
  currentQuestion.options.forEach((option) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="option-label">${option.label}.</span> ${option.text}`;
    optionsEl.appendChild(li);
  });

  answerEl.textContent = `Đáp án: ${currentQuestion.answer}`;
  answerEl.classList.toggle("hidden", !showAnswer);
  toggleAnswerBtn.textContent = showAnswer ? "Ẩn đáp án" : "Hiện đáp án";

  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === quizQuestions.length - 1;
  const isLastQuestion = index === quizQuestions.length - 1;
  realAiBtn.classList.toggle("hidden", !(isLastQuestion && showAnswer));

  speakQuestion(currentQuestion);
}

function appendAiMessage(role, text) {
  const item = document.createElement("div");
  item.className = `ai-message ${role}`;
  item.textContent = text;
  aiMessages.appendChild(item);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

async function sendUserMessage() {
  if (isSending) return;

  const text = aiUserInput.value.trim();
  if (!text) return;

  appendAiMessage("user", text);
  aiUserInput.value = "";
  chatHistory.push({ role: "user", content: text });

  const loadingEl = document.createElement("div");
  loadingEl.className = "ai-message bot";
  loadingEl.textContent = "Đang trả lời...";
  aiMessages.appendChild(loadingEl);
  aiMessages.scrollTop = aiMessages.scrollHeight;

  isSending = true;
  aiSendBtn.disabled = true;

  try {
    const chatApiUrl = resolveChatApiUrl(CHAT_API_URL);
    if (!chatApiUrl) {
      throw new Error("Chưa cấu hình CHAT_API_URL trong config.js.");
    }

    const response = await fetch(chatApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        searchQuery: aiSearchInput.value.trim(),
        history: chatHistory
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Lỗi không xác định từ server.");
    }

    loadingEl.remove();
    const replyText = data.reply || "Xin lỗi, tôi chưa có câu trả lời.";
    appendAiMessage("bot", replyText);
    chatHistory.push({ role: "assistant", content: replyText });
  } catch (error) {
    loadingEl.remove();
    const errorMessage = error instanceof Error ? error.message : "Không gọi được API chat.";
    appendAiMessage("bot", `Lỗi: ${errorMessage}`);
  } finally {
    isSending = false;
    aiSendBtn.disabled = false;
    aiUserInput.focus();
  }
}

prevBtn.addEventListener("click", () => {
  if (index > 0) {
    index -= 1;
    showAnswer = false;
    render();
  }
});

nextBtn.addEventListener("click", () => {
  if (index < quizQuestions.length - 1) {
    index += 1;
    showAnswer = false;
    render();
  }
});

replayBtn.addEventListener("click", () => {
  speakQuestion(quizQuestions[index]);
});

toggleAnswerBtn.addEventListener("click", () => {
  showAnswer = !showAnswer;
  answerEl.classList.toggle("hidden", !showAnswer);
  toggleAnswerBtn.textContent = showAnswer ? "Ẩn đáp án" : "Hiện đáp án";

  const isLastQuestion = index === quizQuestions.length - 1;
  if (showAnswer && isLastQuestion) {
    realAiBtn.classList.remove("hidden");
    playEndAudio();
  } else if (!showAnswer) {
    realAiBtn.classList.add("hidden");
  }
});

realAiBtn.addEventListener("click", () => {
  aiPanel.classList.remove("hidden");
  if (!aiMessages.hasChildNodes()) {
    appendAiMessage("bot", "Xin chào, tôi là Real AI demo. Bạn có thể nhập câu hỏi bên dưới.");
  }
  aiUserInput.focus();
});

aiSendBtn.addEventListener("click", sendUserMessage);

aiUserInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendUserMessage();
  }
});

window.speechSynthesis.addEventListener("voiceschanged", () => {
  render();
});

window.addEventListener("beforeunload", () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  endAudio.pause();
  endAudio.currentTime = 0;
});

render();
