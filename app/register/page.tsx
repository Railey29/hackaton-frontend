"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const anonymousNicknames = [
  "QuietMoon",
  "SilentWave",
  "CalmBreeze",
  "WanderingCloud",
  "GentleRiver",
  "HiddenStar",
  "PeacefulSoul",
  "SoftEcho",
  "StillWater",
  "LostPetal",
  "WhisperWind",
  "FadingLight",
  "TenderHeart",
  "MistyDawn",
  "NightOwl",
  "DriftingLeaf",
  "EmberGlow",
  "SereneSky",
  "VeiledMoon",
  "TimidSpark",
];

function generateNickname() {
  return anonymousNicknames[
    Math.floor(Math.random() * anonymousNicknames.length)
  ];
}

export default function RegisterPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    nickname?: string;
    username?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  function handleGenerateNickname() {
    const generated = generateNickname();
    setNickname(generated);
    setErrors((prev) => ({ ...prev, nickname: undefined }));
  }

  function validate() {
    const errs: {
      nickname?: string;
      username?: string;
      password?: string;
    } = {};

    if (!nickname.trim() || nickname.trim().length < 2)
      errs.nickname = "Nickname must be at least 2 characters.";

    if (!username.trim() || username.trim().length < 3)
      errs.username = "Username must be at least 3 characters.";
    else if (!/^[a-zA-Z0-9_]+$/.test(username.trim()))
      errs.username = "Letters, numbers, and underscores only.";

    if (!password || password.length < 8)
      errs.password = "Password must be at least 8 characters.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim(),
          username: username.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Kung may specific field error galing FastAPI
        if (data.error?.toLowerCase().includes("username")) {
          setErrors({ username: data.error });
        } else if (data.error?.toLowerCase().includes("nickname")) {
          setErrors({ nickname: data.error });
        } else {
          setErrors({ general: data.error || "Registration failed." });
        }
        return;
      }

      router.push("/login");
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #78716c 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-lora text-3xl text-sage-800 font-semibold tracking-tight">
            SafeSpace
          </h1>
          <p className="text-stone-400 text-sm mt-2 font-lora italic">
            a quiet place to let it out
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="font-lora text-xl text-stone-700 font-medium">
              Create Account
            </h2>
            <p className="text-stone-400 text-sm mt-1">
              Your identity stays private, always
            </p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
              <p className="text-xs text-red-500 text-center">
                {errors.general}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* Nickname */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-stone-500 tracking-wide">
                Nickname
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setErrors((prev) => ({ ...prev, nickname: undefined }));
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Your display name"
                  maxLength={32}
                  className={`flex-1 border rounded-xl px-4 py-3 text-[15px] text-stone-700 placeholder:text-stone-300 outline-none transition-colors ${
                    errors.nickname
                      ? "border-red-300 focus:border-red-400"
                      : "border-stone-200 focus:border-sage-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleGenerateNickname}
                  title="Generate anonymous nickname"
                  className="px-3 py-3 rounded-xl border border-stone-200 hover:border-sage-300 hover:bg-sage-50 text-stone-400 hover:text-sage-600 transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="3" />
                    <circle
                      cx="8"
                      cy="8"
                      r="1.5"
                      fill="currentColor"
                      stroke="none"
                    />
                    <circle
                      cx="16"
                      cy="8"
                      r="1.5"
                      fill="currentColor"
                      stroke="none"
                    />
                    <circle
                      cx="8"
                      cy="16"
                      r="1.5"
                      fill="currentColor"
                      stroke="none"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="1.5"
                      fill="currentColor"
                      stroke="none"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="1.5"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </button>
              </div>
              {errors.nickname ? (
                <p className="text-xs text-red-400 px-1">{errors.nickname}</p>
              ) : (
                <p className="text-xs text-stone-300 px-1">
                  Click 🎲 to generate an anonymous nickname
                </p>
              )}
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-stone-500 tracking-wide">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors((prev) => ({ ...prev, username: undefined }));
                }}
                onKeyDown={handleKeyDown}
                placeholder="e.g. quietsoul"
                maxLength={24}
                autoComplete="username"
                className={`w-full border rounded-xl px-4 py-3 text-[15px] text-stone-700 placeholder:text-stone-300 outline-none transition-colors ${
                  errors.username
                    ? "border-red-300 focus:border-red-400"
                    : "border-stone-200 focus:border-sage-300"
                }`}
              />
              {errors.username && (
                <p className="text-xs text-red-400 px-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-stone-500 tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className={`w-full border rounded-xl px-4 py-3 pr-12 text-[15px] text-stone-700 placeholder:text-stone-300 outline-none transition-colors ${
                    errors.password
                      ? "border-red-300 focus:border-red-400"
                      : "border-stone-200 focus:border-sage-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 px-1">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-stone-100" />
              <span className="text-xs text-stone-300">or</span>
              <div className="flex-1 h-px bg-stone-100" />
            </div>

            {/* Login link */}
            <p className="text-center text-sm text-stone-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-sage-600 hover:text-sage-700 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-stone-300 mt-6">
          Your identity is never shared. Ever.
        </p>
      </div>
    </div>
  );
}
