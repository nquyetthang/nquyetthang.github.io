import QuizPlayer from "@/components/QuizPlayer";
import { quizQuestions } from "@/lib/questions";

export default function HomePage() {
  return (
    <main className="page">
      <section className="card">
        <h1>Trac nghiem doc bang giong may</h1>
        <p>Moi lan chuyen cau hoi, he thong se tu dong doc noi dung cau hoi.</p>
        <QuizPlayer questions={quizQuestions} />
      </section>
    </main>
  );
}
