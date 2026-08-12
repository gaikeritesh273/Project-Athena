'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  category: string;
  difficulty: string;
}

interface Answer {
  question_id: string;
  selected_index: number | null;
  time_taken_seconds: number;
}

export default function Trainer() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 5 }),
      });

      if (!res.ok) {
        throw new Error('Unable to load quiz questions');
      }

      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error('Unable to fetch quiz questions', err);
      toast.error('Using sample questions while the quiz service is unavailable.');
      setQuestions([
        {
          id: 'q1',
          question: 'A headline reads: "SHOCKING: Doctors HIDE This One Secret!" What is the most likely bias indicator?',
          options: ['It cites peer-reviewed research', 'It uses emotional trigger words and implies a conspiracy', 'It presents balanced viewpoints', 'It includes specific medical data'],
          correct_index: 1,
          explanation: 'Words like "SHOCKING" and "HIDE" are fear/urgency triggers. "One secret" implies conspiracy without evidence.',
          category: 'Headline Analysis',
          difficulty: 'easy',
        },
        {
          id: 'q2',
          question: 'You see an image of a politician at a rally. The caption says "Record-breaking attendance!" but the image is a tight crop. What should you check first?',
          options: ['The speech transcript', 'The full uncropped image', 'The photographer affiliation', 'The weather'],
          correct_index: 1,
          explanation: 'Cropped images can create false impressions. Always look for the original, uncropped version.',
          category: 'Image Verification',
          difficulty: 'easy',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (showExplanation || selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
    if (index === questions[current].correct_index) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    const currentAnswer: Answer = {
      question_id: questions[current].id,
      selected_index: selected,
      time_taken_seconds: 10,
    };
    const nextAnswers = [...answers, currentAnswer];

    setAnswers(nextAnswers);

    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
      void submitQuiz(nextAnswers);
    }
  };

  const submitQuiz = async (quizAnswers: Answer[]) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: quizAnswers }),
      });
    } catch (err) {
      console.error('Unable to submit quiz answers', err);
    }
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setFinished(false);
    void fetchQuestions();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-athena-offwhite flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (finished) {
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    return (
      <div className="min-h-screen bg-athena-offwhite py-12 px-4">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-8">
            <Trophy className="w-20 h-20 text-athena-amber mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-athena-indigo mb-2">Quiz Complete!</h1>
            <p className="text-athena-muted">You scored {score} out of {questions.length}</p>
          </motion.div>

          <div className={`text-5xl font-bold mb-8 ${percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-athena-amber' : 'text-athena-alert'}`}>
            {percentage}%
          </div>

          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-all"
          >
            <RotateCcw className="w-5 h-5" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = questions.length || 1;
  const q = questions[current];

  if (!q) {
    return (
      <div className="min-h-screen bg-athena-offwhite py-12 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-bold text-athena-indigo mb-4">No questions available</h1>
          <p className="text-athena-muted mb-6">The quiz service did not return any questions right now.</p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-all"
          >
            <RotateCcw className="w-5 h-5" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-athena-offwhite py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-athena-indigo flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-500" /> Media Trainer
          </h1>
          <span className="text-sm text-athena-muted">Question {current + 1} of {totalQuestions}</span>
        </div>

        <div className="w-full bg-athena-border rounded-full h-2 mb-8">
          <motion.div
            className="bg-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((current + 1) / totalQuestions) * 100}%`}}
          />
        </div>

        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-athena-border shadow-sm p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-50 text-purple-600">{q.category}</span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-athena-offwhite text-athena-muted">{q.difficulty}</span>
          </div>
          <h2 className="text-lg font-semibold text-athena-indigo mb-6">{q.question}</h2>

          <div className="space-y-3">
            {q.options.map((option, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.correct_index;
              let btnClass = 'p-4 rounded-xl border-2 text-left transition-all text-sm ';
              if (showExplanation) {
                if (isCorrect) btnClass += 'border-green-500 bg-green-50 text-green-800';
                else if (isSelected) btnClass += 'border-red-500 bg-red-50 text-red-800';
                else btnClass += 'border-athena-border bg-white text-athena-muted';
              } else {
                btnClass += isSelected ? 'border-purple-500 bg-purple-50 text-athena-indigo' : 'border-athena-border bg-white hover:border-purple-300 text-athena-text';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showExplanation}
                  className={btnClass + ' w-full flex items-center gap-3'}
                >
                  {showExplanation && isCorrect && <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />}
                  {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                  <span className="font-mono text-xs text-athena-muted w-6">{String.fromCharCode(65 + i)}</span>
                  {option}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-200"
              >
                <p className="text-sm text-athena-indigo">{q.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {showExplanation && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
          >
            {current < questions.length - 1 ? <>Next <ArrowRight className="w-5 h-5" /></> : 'Finish Quiz'}
          </motion.button>
        )}
      </div>
    </div>
  );
}