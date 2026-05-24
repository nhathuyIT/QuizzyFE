"use client";

import { useEffect, useRef, useState } from "react";

interface Question {
  q: string;
  opts: string[];
  correct: number;
}

const questions: Question[] = [
  {
    q: "What is the powerhouse of the cell?",
    opts: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"],
    correct: 1,
  },
  {
    q: "How many chambers does the human heart have?",
    opts: ["Two", "Three", "Four", "Six"],
    correct: 2,
  },
  {
    q: "Which molecule carries genetic information?",
    opts: ["ATP", "mRNA", "DNA", "Protein"],
    correct: 2,
  },
  {
    q: "What process do plants use to make food?",
    opts: ["Respiration", "Fermentation", "Photosynthesis", "Transpiration"],
    correct: 2,
  },
  {
    q: "Which blood cells fight infection?",
    opts: ["Red blood cells", "Platelets", "Plasma", "White blood cells"],
    correct: 3,
  },
];

const tags = ["Biology", "History", "Math", "Chemistry", "Languages"];

export function QuizDemoSection() {
  const [currentQ, setCurrentQ] = useState(0);
  const [streak, setStreak] = useState(4);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [floatingStreak, setFloatingStreak] = useState(4);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [burstLabel, setBurstLabel] = useState("");
  const [showBurst, setShowBurst] = useState(false);

  const progressRef = useRef<HTMLDivElement>(null);
  const questionTextRef = useRef<HTMLDivElement>(null);
  const questionCountRef = useRef<HTMLSpanElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const streakCountRef = useRef<HTMLSpanElement>(null);
  const floatingBadgeRef = useRef<HTMLDivElement>(null);
  const fsNumberRef = useRef<HTMLSpanElement>(null);
  const fsBurstRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.6;
      setBadgeVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 80);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const updateProgress = () => {
    if (progressRef.current) {
      progressRef.current.style.width = `${(currentQ / questions.length) * 100}%`;
    }
    if (questionCountRef.current) {
      questionCountRef.current.textContent = `${currentQ + 1} / ${questions.length}`;
    }
    if (streakCountRef.current) {
      streakCountRef.current.textContent = `${streak} streak`;
    }
  };

  useEffect(() => {
    updateProgress();
  }, [currentQ, streak]);

  const selectOption = (idx: number) => {
    if (answered) return;
    setAnswered(true);
    setSelectedIdx(idx);

    const isCorrect = idx === questions[currentQ].correct;
    let newStreak = streak;

    if (isCorrect) {
      newStreak = streak + 1;
      setStreak(newStreak);
    } else {
      newStreak = 0;
      setStreak(0);
    }

    // Update floating streak
    setFloatingStreak(newStreak);
    if (fsNumberRef.current) {
      fsNumberRef.current.textContent = String(newStreak);
    }

    // Pop animation
    if (floatingBadgeRef.current) {
      floatingBadgeRef.current.classList.remove("pop");
      void floatingBadgeRef.current.offsetWidth;
      floatingBadgeRef.current.classList.add("pop");
    }

    // Burst label
    if (newStreak > 0 && newStreak % 3 === 0) {
      const labels: Record<number, string> = {
        3: "On fire!",
        6: "Blazing!",
        9: "Unstoppable!",
        12: "Legendary!",
      };
      setBurstLabel(labels[newStreak] || `${newStreak}x combo!`);
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 2200);
    }
  };

  const nextQuestion = () => {
    setCurrentQ((prev) => (prev + 1) % questions.length);
    setAnswered(false);
    setSelectedIdx(null);
  };

  const letters = ["A", "B", "C", "D"];
  const q = questions[currentQ];

  return (
    <section className="demo-section">
      <div className="demo-info fade-up">
        <div className="section-tag">Interactive Demo</div>
        <h2 className="section-heading">Try a quiz<br />right now.</h2>
        <p>
          Experience the clean, distraction-free quiz interface that keeps learners
          in the zone. Choose an answer below.
        </p>
        <div className="demo-tags">
          {tags.map((tag, i) => (
            <span key={i} className={`tag ${i === 0 ? "tag-fill" : ""}`}>
              {tag}
            </span>
          ))}
        </div>
        <a href="#" className="btn-primary">
          Start full quiz →
        </a>
        <a href="#" className="btn-outline">
          Browse decks
        </a>
      </div>

      <div className="quiz-card-ui fade-up">
        <div className="qc-header">
          <span className="qc-subject">Biology</span>
          <div className="qc-progress-bar">
            <div className="qc-progress-fill" ref={progressRef}></div>
          </div>
          <span className="qc-count" ref={questionCountRef}>
            {currentQ + 1} / {questions.length}
          </span>
        </div>
        <div className="qc-question" ref={questionTextRef}>
          {q.q}
        </div>
        <div className="qc-options" ref={optionsContainerRef}>
          {q.opts.map((opt, i) => {
            let className = "qc-option";
            if (answered) {
              if (i === q.correct) {
                className += " correct";
              } else if (i === selectedIdx && i !== q.correct) {
                className += " wrong";
              }
            }
            return (
              <div
                key={i}
                className={className}
                onClick={() => selectOption(i)}
              >
                <span className="opt-letter">{letters[i]}</span>
                {opt}
              </div>
            );
          })}
        </div>
        <div className="qc-footer">
          <div className="streak-badge">
            <span className="flame">🔥</span>
            <span ref={streakCountRef}>{streak} streak</span>
          </div>
          <button className="next-btn" onClick={nextQuestion}>
            Next →
          </button>
        </div>
      </div>

      {/* Floating Streak Badge */}
      <div
        id="floatingStreak"
        ref={floatingBadgeRef}
        className={badgeVisible ? "visible" : ""}
        title="Keep your streak going!"
      >
        <div className="fs-body">
          <div className="fs-ring"></div>
          <span className={`fs-burst ${showBurst ? "show" : ""}`}>
            {burstLabel}
          </span>
          <span className="fs-flame">🔥</span>
          <span className="fs-number" ref={fsNumberRef}>
            {floatingStreak}
          </span>
          <span className="fs-label">Day streak</span>
        </div>
        <div className="fs-cta">Keep it going →</div>
      </div>
    </section>
  );
}
