"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  function validate() {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      newErrors.username = "Please enter your username.";
    }
    if (!password) {
      newErrors.password = "Please enter your password.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setErrors({ password: "Invalid username or password." });
        } else if (data.error) {
          setErrors({ username: data.error });
        } else {
          setErrors({ username: "Login failed. Please try again." });
        }
        setIsLoading(false);
        return;
      }

      const userData = data;

      if (!userData?.token) {
        throw new Error("No token received");
      }

      localStorage.setItem("ss_token", userData.token);
      localStorage.setItem("ss_user_id", userData.user_id);
      localStorage.setItem("ss_alias", userData.username);
      localStorage.setItem("ss_nickname", userData.nickname);
      localStorage.setItem(
        "ss_initials",
        userData.username.slice(0, 2).toUpperCase(),
      );
      localStorage.setItem("ss_avatarColor", "bg-sage-300");
      localStorage.setItem("ss_isAnonymous", "false");
      localStorage.setItem("ss_newLogin", "true");

      setIsLoading(false);
      router.push("/feed");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ username: "Network error. Please try again." });
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin();
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
              Welcome back
            </h2>
            <p className="text-stone-400 text-sm mt-1">
              Sign in to your safe space
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Username */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="username"
                className="text-xs font-medium text-stone-500 tracking-wide"
              >
                Username
              </label>
              <input
                id="username"
                autoFocus
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors((prev) => ({ ...prev, username: undefined }));
                }}
                onKeyDown={handleKeyDown}
                placeholder="e.g. quietsoul, mharcos22"
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
              <label
                htmlFor="password"
                className="text-xs font-medium text-stone-500 tracking-wide"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  autoComplete="current-password"
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

            {/* Forgot password */}
            <div className="flex justify-end -mt-2">
              <button
                type="button"
                className="text-xs text-stone-400 hover:text-sage-600 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
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
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-stone-100" />
              <span className="text-xs text-stone-300">or</span>
              <div className="flex-1 h-px bg-stone-100" />
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-stone-400">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-sage-600 hover:text-sage-700 font-medium transition-colors"
              >
                Create one
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
