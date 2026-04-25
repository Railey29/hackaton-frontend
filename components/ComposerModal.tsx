"use client";

import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { FlairType } from '@/lib/rants';
import { FlairPill } from './FlairPill';

const FLAIRS: FlairType[] = ['Anxiety', 'Burnout', 'Grief', 'Loneliness', 'Just venting', 'Feeling lost'];
const MOODS = [
  { name: 'Calm', color: 'bg-green-400' },
  { name: 'Anxious', color: 'bg-purple-400' },
  { name: 'Angry', color: 'bg-red-400' },
  { name: 'Sad', color: 'bg-blue-400' },
  { name: 'Numb', color: 'bg-stone-300' }
];

type ComposerModalProps = {
  onClose: () => void;
};

export function ComposerModal({ onClose }: ComposerModalProps) {
  const [text, setText] = useState('');
  const [selectedFlair, setSelectedFlair] = useState<FlairType | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const charCount = text.length;
  const isOverWarningLimit = charCount > 400;
  const isValid = selectedFlair !== null && text.length > 10;

  const handleSubmit = () => {
    if (isValid) {
      setIsSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sage-800/40 p-4">
      
      <div className="w-full max-w-[600px] bg-white rounded-xl border border-stone-200 flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="font-lora text-lg font-semibold text-sage-800">Share a rant</h2>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle2 size={48} className="text-sage-500 mb-4" />
            <h3 className="font-lora text-xl font-medium text-sage-800 mb-2">Your rant is out there</h3>
            <p className="text-stone-500 mb-8 max-w-sm">
              Thank you for sharing. Remember, whatever you're feeling is valid, and you're not alone.
            </p>
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl transition-colors text-sm"
            >
              Back to feed
            </button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="p-6 flex flex-col gap-6">
              
              {/* Anonymity Notice */}
              <div className="bg-sage-100 rounded-lg p-3 px-4 flex items-center gap-3 text-sm border border-sage-200">
                <div className="w-6 h-6 rounded-full bg-sage-300 flex items-center justify-center text-[10px] font-bold text-sage-800 shrink-0">W</div>
                <div className="text-sage-800 flex flex-col sm:flex-row sm:gap-1.5 leading-snug">
                  <span className="font-semibold">quiet_wanderer</span>
                  <span className="text-sage-600 sm:before:content-['•'] sm:before:mr-1.5">Your real identity is hidden.</span>
                </div>
              </div>

              {/* Flair Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  What's this about?
                </label>
                <div className="flex flex-wrap gap-2">
                  {FLAIRS.map(flair => (
                    <FlairPill 
                      key={flair} 
                      flair={flair} 
                      selected={selectedFlair === flair}
                      onClick={() => setSelectedFlair(flair)}
                    />
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div>
                <textarea 
                  className="w-full min-h-[140px] resize-none border px-4 py-3 rounded-xl border-stone-200 focus:border-sage-400 focus:ring-1 focus:ring-sage-400 outline-none transition-colors font-lora text-stone-700 placeholder:text-stone-300"
                  placeholder="Let it out. Nobody here will judge you..."
                  maxLength={500}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  aria-label="Rant content"
                />
                <div className={`text-right text-xs mt-2 font-medium ${isOverWarningLimit ? 'text-sage-600' : 'text-stone-400'}`}>
                  {charCount} / 500
                </div>
              </div>

              {/* Mood Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Current Mood
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map(mood => {
                    const isSelected = selectedMood === mood.name;
                    return (
                      <button
                        key={mood.name}
                        onClick={() => setSelectedMood(mood.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                          isSelected 
                            ? 'bg-sage-100 border-sage-300 text-sage-800' 
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${mood.color}`} />
                        {mood.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visibility indicator */}
              <div className="bg-stone-50 rounded-lg p-3 border border-stone-200 flex items-center gap-2 text-sm text-stone-500">
                <span className="font-medium text-stone-600">Visible to</span> → Everyone (anonymous)
              </div>

            </div>

            {/* Footer */}
            <div className="mt-auto px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-4">
              <span className="text-xs text-stone-500 hidden sm:block">
                Take a deep breath. We're here for you.
              </span>
              <button 
                onClick={handleSubmit}
                disabled={!isValid}
                className="w-full sm:w-auto px-6 py-2.5 bg-sage-500 hover:bg-sage-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-medium rounded-xl transition-colors text-sm ml-auto"
              >
                Post rant
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
