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

const counterEl = document.getElementById("counter");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const answerEl = document.getElementById("answer");

const prevBtn = document.getElementById("prevBtn");
const replayBtn = document.getElementById("replayBtn");
const toggleAnswerBtn = document.getElementById("toggleAnswerBtn");
const nextBtn = document.getElementById("nextBtn");

let index = 0;
let showAnswer = false;

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

  speakQuestion(currentQuestion);
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
});

window.speechSynthesis.addEventListener("voiceschanged", () => {
  render();
});

window.addEventListener("beforeunload", () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});

render();
