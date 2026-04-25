import React, { useEffect, useState } from "react";

const MOODS = [
  { name: "Calm", color: "bg-[#9dc4bb]" },
  { name: "Anxious", color: "bg-[#afa9ec]" },
  { name: "Angry", color: "bg-[#f0997b]" },
  { name: "Sad", color: "bg-[#85b7eb]" },
  { name: "Numb", color: "bg-[#c2ddd6]" },
  { name: "Overwhelmed", color: "bg-[#fac775]" },
];

export function MoodPicker() {
  const [mounted, setMounted] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>("Anxious");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch if browser extensions inject DOM attributes before React loads.
  if (!mounted) return null;

  return (
    <div className="grid grid-cols-2 gap-1">
      {MOODS.map((mood) => {
        const isSelected = selectedMood === mood.name;
        return (
          <button
            key={mood.name}
            onClick={() => setSelectedMood(mood.name)}
            className={`px-[8px] py-[6px] rounded-[7px] border flex items-center gap-[5px] font-dm-sans text-[11px] transition-colors ${
              isSelected
                ? "bg-sage-100 border-sage-300 text-sage-700 on"
                : "bg-white border-sage-100 text-stone-600 hover:bg-sage-50"
            }`}
          >
            <div
              className={`w-[7px] h-[7px] rounded-full shrink-0 ${mood.color}`}
            />
            <span className="truncate">{mood.name}</span>
          </button>
        );
      })}
    </div>
  );
}
