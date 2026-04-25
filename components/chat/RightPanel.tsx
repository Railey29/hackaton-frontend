"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Stress Assessment Types ───────────────────────────────────────────────
interface StressInputData {
  fin: number; // 1-10 (higher = more stress)
  prices: number; // 1-10
  health: number; // 1-10
  school: number; // 1-10
  family: number; // 1-10
}

const STRESS_QUESTIONS: {
  key: keyof StressInputData;
  label: string;
  question: string;
}[] = [
  {
    key: "fin",
    label: "Finances",
    question: "How stressed are you about your finances right now?",
  },
  {
    key: "prices",
    label: "Prices",
    question: "How stressed are you about the price of goods and bills?",
  },
  {
    key: "health",
    label: "Health",
    question: "How stressed are you about your health right now?",
  },
  {
    key: "school",
    label: "School/Work",
    question: "How stressed are you about school or work right now?",
  },
  {
    key: "family",
    label: "Family",
    question: "How stressed are you about family or relationships right now?",
  },
];

const DEFAULT_STRESS_DATA: StressInputData = {
  fin: 0,
  prices: 0,
  health: 0,
  school: 0,
  family: 0,
};

interface RightPanelProps {
  onStartAssessment?: () => void;
  onSubmitAssessment?: (data: StressInputData) => void;
  isAssessmentMode?: boolean;
  analysisText?: string | null;
  analysisLoading?: boolean;
}

export function RightPanel({
  onStartAssessment,
  onSubmitAssessment,
  isAssessmentMode = false,
  analysisText = null,
  analysisLoading = false,
}: RightPanelProps) {
  const router = useRouter();

  // ── Stress Assessment State ──
  const [assessmentData, setAssessmentData] =
    useState<StressInputData>(DEFAULT_STRESS_DATA);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);

  const handlePostToFeed = () => {
    router.push("/feed");
  };

  const handleStartAssessment = () => {
    setIsAssessmentStarted(true);
    setCurrentQuestionIndex(0);
    setAssessmentData(DEFAULT_STRESS_DATA);
    setIsAssessmentComplete(false);
    onStartAssessment?.();
  };

  const handleScoreChange = (score: number) => {
    const field = STRESS_QUESTIONS[currentQuestionIndex].key;
    const newData = { ...assessmentData, [field]: score };
    setAssessmentData(newData);

    // Move to next question or complete
    if (currentQuestionIndex < STRESS_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 300);
    } else {
      // All questions answered - use the accumulated data
      // Since setState is async, we use the newData which has all fields accumulated
      const completeData: StressInputData = {
        fin: newData.fin,
        prices: newData.prices,
        health: newData.health,
        school: newData.school,
        family: newData.family,
      };

      // Debug log to check data
      console.log("Assessment complete:", completeData);

      setTimeout(() => {
        setIsAssessmentComplete(true);
        onSubmitAssessment?.(completeData);
      }, 300);
    }
  };

  const handleResetAssessment = () => {
    setIsAssessmentStarted(false);
    setIsAssessmentComplete(false);
    setCurrentQuestionIndex(0);
    setAssessmentData(DEFAULT_STRESS_DATA);
    // Notify parent to reset state
    onStartAssessment?.();
  };

  // ── Render Assessment Mode (Static Questions on Left) ──
  if (isAssessmentMode || isAssessmentStarted) {
    const currentQuestion = STRESS_QUESTIONS[currentQuestionIndex];
    const progress =
      ((currentQuestionIndex + 1) / STRESS_QUESTIONS.length) * 100;

    return (
      <div className="w-[220px] bg-white border-l border-sage-100 flex flex-col h-full overflow-y-auto">
        {/* Assessment Header */}
        <div className="p-[14px] border-b border-sage-100 bg-sage-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] uppercase tracking-[0.06em] text-sage-600 font-semibold">
              Stress Assessment
            </h3>
            <button
              onClick={handleResetAssessment}
              className="text-[10px] text-stone-400 hover:text-stone-600"
            >
              ✕ Cancel
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-sage-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-sage-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-stone-400">
            Question {currentQuestionIndex + 1} of {STRESS_QUESTIONS.length}
          </p>
        </div>

        {/* Static Question (Left Side) */}
        <div className="p-[14px] border-b border-sage-100">
          {!isAssessmentComplete ? (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-500 font-medium block mb-1">
                  {currentQuestion.label}
                </label>
                <p className="text-[13px] text-sage-800 font-lora leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Score Selector 1-10 */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] text-stone-400">
                  <span>Low (1)</span>
                  <span>High (10)</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleScoreChange(num)}
                      className={`py-2 rounded text-[11px] font-medium transition-all ${
                        assessmentData[currentQuestion.key] === num
                          ? "bg-sage-500 text-white"
                          : "bg-sage-50 text-stone-600 hover:bg-sage-100 border border-sage-200"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Score Display */}
              {assessmentData[currentQuestion.key] > 0 && (
                <div className="text-center">
                  <span className="text-[24px] font-lora text-sage-600 font-bold">
                    {assessmentData[currentQuestion.key]}
                  </span>
                  <span className="text-[10px] text-stone-400 ml-1">/10</span>
                </div>
              )}
            </div>
          ) : (
            /* Assessment Complete - Show Summary */
            <div className="space-y-3">
              <div className="text-center py-2">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-sage-100 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <p className="text-[11px] text-sage-600 font-medium">
                  Assessment Complete!
                </p>
                <p className="text-[10px] text-stone-400 mt-1">
                  Your AI analysis is ready below
                </p>
              </div>

              {/* AI Analysis */}
              <div className="border border-sage-200 rounded-[8px] bg-sage-50 px-2.5 py-2">
                <div className="text-[10px] uppercase tracking-[0.06em] text-sage-600 font-semibold mb-1">
                  AI Analysis
                </div>
                {analysisLoading ? (
                  <p className="text-[11px] text-stone-500 leading-[1.45]">
                    Generating your analysis...
                  </p>
                ) : analysisText ? (
                  <p className="text-[11px] text-stone-700 leading-[1.45] whitespace-pre-wrap max-h-[130px] overflow-y-auto pr-1">
                    {analysisText}
                  </p>
                ) : (
                  <p className="text-[11px] text-stone-500 leading-[1.45]">
                    No analysis yet.
                  </p>
                )}
              </div>

              {/* Summary of Answers */}
              <div className="space-y-2">
                {STRESS_QUESTIONS.map((q) => (
                  <div
                    key={q.key}
                    className="flex justify-between items-center text-[11px]"
                  >
                    <span className="text-stone-500">{q.label}</span>
                    <span
                      className={`font-medium ${
                        assessmentData[q.key] <= 3
                          ? "text-green-600"
                          : assessmentData[q.key] <= 6
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {assessmentData[q.key]}/10
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleResetAssessment}
                className="w-full py-2 text-[11px] text-sage-600 border border-sage-200 rounded hover:bg-sage-50"
              >
                Start New Assessment
              </button>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="px-[14px] pb-[14px]">
          <h3 className="text-[10px] uppercase tracking-[0.06em] text-stone-400 font-semibold mb-[10px]">
            Remember
          </h3>
          <div className="flex flex-col gap-2.5">
            {[
              "This assessment is private and tied only to your anonymous alias.",
              "AlphaBot won't diagnose you or give medical advice — just a space to breathe.",
              "If you're in crisis, please reach out to someone you trust or a local helpline.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-[7px]">
                <div className="w-[4px] h-[4px] bg-sage-300 rounded-full shrink-0 mt-[6px]" />
                <p className="text-[11px] text-stone-600 leading-[1.4]">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Default Mode (Normal Right Panel) ──

  return (
    <div className="w-[220px] bg-white border-l border-sage-100 flex flex-col h-full overflow-y-auto">
      {/* Assessment Button */}
      <div className="p-[14px] border-b border-sage-100">
        <h3 className="text-[10px] uppercase tracking-[0.06em] text-stone-400 font-semibold mb-[10px]">
          Stress Check
        </h3>
        <button
          onClick={handleStartAssessment}
          className="w-full bg-sage-100 hover:bg-sage-200 border border-sage-200 rounded-[7px] py-[8px] text-[12px] text-sage-700 font-medium transition-colors"
        >
          Start Stress Check →
        </button>
      </div>

      {/* Section 3 */}
      <div className="m-[14px] bg-sage-50 border border-sage-200 rounded-[10px] p-[12px]">
        <h4 className="font-lora text-[13px] text-sage-800 font-semibold mb-1.5">
          Share with others
        </h4>
        <p className="text-[11px] text-sage-600 leading-[1.5] mb-3">
          Turn what you're feeling into an anonymous rant. Someone out there
          will feel less alone reading it.
        </p>
        <button
          onClick={handlePostToFeed}
          className="w-full bg-sage-500 hover:opacity-85 text-white rounded-[7px] py-[6px] font-dm-sans text-[11px] font-medium transition-opacity"
        >
          Post to feed →
        </button>
      </div>

      {/* Section 4 */}
      <div className="px-[14px] pb-[14px]">
        <h3 className="text-[10px] uppercase tracking-[0.06em] text-stone-400 font-semibold mb-[10px]">
          Remember
        </h3>
        <div className="flex flex-col gap-2.5">
          {[
            "This conversation is private and tied only to your anonymous alias.",
            "AlphaBot won't diagnose you or give medical advice — just a space to breathe.",
            "If you're in crisis, please reach out to someone you trust or a local helpline.",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-[7px]">
              <div className="w-[4px] h-[4px] bg-sage-300 rounded-full shrink-0 mt-[6px]" />
              <p className="text-[11px] text-stone-600 leading-[1.4]">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
