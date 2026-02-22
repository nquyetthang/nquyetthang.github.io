export type QuizQuestion = {
  question: string;
  options: Array<{ label: "A" | "B" | "C" | "D"; text: string }>;
  answer: "A" | "B" | "C" | "D";
};

export const quizQuestions: QuizQuestion[] = [
  {
    question: "Yếu tố quan trọng nhất giúp bài văn nghị luận xã hội thuyết phục người đọc là gì?",
    options: [
      { label: "A", text: "Sử dụng nhiều từ ngữ hoa mỹ" },
      { label: "B", text: "Đưa ra luận điểm rõ ràng, lập luận chặt chẽ và dẫn chứng thuyết phục" },
      { label: "C", text: "Kể nhiều câu chuyện thú vị" },
      { label: "D", text: "Viết thật dài và sử dụng từ ngữ khó hiểu" },
    ],
    answer: "B",
  },
  {
    question: "Khi viết đoạn văn nghị luận xã hội, vì sao cần có dẫn chứng thực tế?",
    options: [
      { label: "A", text: "Để bài viết dài hơn" },
      { label: "B", text: "Để làm cho bài viết thêm sinh động và thuyết phục" },
      { label: "C", text: "Để gây ấn tượng với người đọc" },
      { label: "D", text: "Không nhất thiết phải có dẫn chứng" },
    ],
    answer: "B",
  },
  {
    question: "Văn bản nghị luận xã hội nhằm mục đích gì?",
    options: [
      { label: "A", text: "Giải thích các vấn đề khoa học" },
      { label: "B", text: "Bàn luận, đánh giá một vấn đề trong đời sống xã hội" },
      { label: "C", text: "Kể lại các sự kiện đã xảy ra" },
      { label: "D", text: "Giới thiệu một tác phẩm văn học" },
    ],
    answer: "B",
  },
  {
    question: "Luận điểm trong bài nghị luận xã hội cần phải đảm bảo điều gì?",
    options: [
      { label: "A", text: "Ngắn gọn, rõ ràng, có tính thuyết phục" },
      { label: "B", text: "Được trình bày dưới dạng câu chuyện dài" },
      { label: "C", text: "Không cần nhất quán, có thể thay đổi tùy ý" },
      { label: "D", text: "Chỉ cần nêu lên mà không cần giải thích hay chứng minh" },
    ],
    answer: "A",
  },
  {
    question: "Dẫn chứng trong văn bản nghị luận xã hội cần đảm bảo yêu cầu nào sau đây?",
    options: [
      { label: "A", text: "Phải là những câu chuyện hư cấu để làm nổi bật vấn đề" },
      { label: "B", text: "Càng nhiều càng tốt, không quan trọng tính xác thực" },
      { label: "C", text: "Cụ thể, chân thực, có tính tiêu biểu và thuyết phục" },
      { label: "D", text: "Không cần dẫn chứng, chỉ cần lập luận là đủ" },
    ],
    answer: "C",
  },
];
