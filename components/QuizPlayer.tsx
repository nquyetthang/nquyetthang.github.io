"use client";

import { useEffect, useMemo, useState } from "react";
import type { QuizQuestion } from "@/lib/questions";

type QuizPlayerProps = {
  questions: QuizQuestion[];
};

function buildSpeechText(question: QuizQuestion): string {
  const optionsText = question.options.map((option) => `${option.label}. ${option.text}`).join(". ");
  return `${question.question}. ${optionsText}`;
}

export default function QuizPlayer({ questions }: QuizPlayerProps) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const currentQuestion = useMemo(() => questions[index], [questions, index]);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 1;

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("vi"));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    speak(buildSpeechText(currentQuestion));
    setShowAnswer(false);

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestion]);

  const goNext = () => {
    setIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const goPrevious = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="quiz-wrap">
      <p className="counter">
        Cau {index + 1}/{questions.length}
      </p>

      <h2 className="question">{currentQuestion.question}</h2>

      <ul className="option-list">
        {currentQuestion.options.map((option) => (
          <li key={option.label}>
            <span className="option-label">{option.label}.</span> {option.text}
          </li>
        ))}
      </ul>

      {showAnswer ? <p className="answer">Dap an: {currentQuestion.answer}</p> : null}

      <div className="actions">
        <button onClick={goPrevious} disabled={index === 0}>
          Cau truoc
        </button>
        <button onClick={() => speak(buildSpeechText(currentQuestion))}>Doc lai</button>
        <button onClick={() => setShowAnswer((prev) => !prev)}>{showAnswer ? "An dap an" : "Hien dap an"}</button>
        <button onClick={goNext} disabled={index === questions.length - 1}>
          Cau tiep
        </button>
      </div>
    </div>
  );
}
