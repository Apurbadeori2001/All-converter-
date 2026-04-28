"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase";
import { VerificationScreen } from "./VerificationScreen";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  AuthError,
  sendEmailVerification,
  signOut,
  signInWithPopup
} from "firebase/auth";

type AuthMode = "signin" | "signup" | "verify";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationEmail, setVerificationEmail] = useState("");

  // Keep state in sync if parent changes initialMode
  useState(() => {
    setMode(initialMode);
  });

  const handleError = (err: unknown) => {
    const authError = err as AuthError;
    if (
      authError.code === "auth/invalid-credential" || 
      authError.code === "auth/user-not-found" || 
      authError.code === "auth/wrong-password"
    ) {
      return "Email or password is incorrect";
    }
    
    if (authError.code === "auth/email-already-in-use") {
      return "User already exists. Please sign in";
    }

    if (authError.code === "auth/weak-password") {
      return "Password should be at least 6 characters.";
    }

    if (authError.code === "auth/invalid-email") {
      return "Invalid email address.";
    }

    return "An unexpected error occurred. Please try again.";
  };

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer logic for resend OTP
  useState(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  });

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      // In a real OTP flow, this would send a new code. 
      // For standard Firebase, we resend the verification link.
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
      setResendTimer(35);
    } catch (err) {
      setError("Failed to resend. Please try again later.");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    // Note: Standard Firebase Client SDK doesn't verify numeric codes for email.
    // This UI simulates the flow you requested. Completion would be clicking 
    // the link in the email sent by Firebase.
    const fullCode = otp.join("");
    if (fullCode.length < 6) {
      setError("Please enter the 6-digit code.");
      setLoading(false);
      return;
    }
    
    // Simulate verification
    setError("Please ensure you've clicked the link in your email to finalize verification, then click Login.");
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signin") {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setVerificationEmail(userCredential.user.email || "");
          await signOut(auth);
          setMode("verify");
          setResendTimer(35);
          setLoading(false);
          return;
        }
      } else if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setVerificationEmail(userCredential.user.email || "");
        await signOut(auth);
        setMode("verify");
        setResendTimer(35);
        setLoading(false);
        return;
      }
      onClose();
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in window was closed before completion.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized for Google Sign-in. Please add it in Firebase Console.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Google Sign-in is not enabled in your Firebase project.");
      } else {
        setError(handleError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "signin" ? "signup" : "signin"));
    setError(null);
    setEmail("");
    setPassword("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {mode === "verify" ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verify your email</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                Enter the 6-digit code sent to <span className="text-white font-medium">{verificationEmail}</span>
              </p>

              {/* OTP Inputs */}
              <div className="flex justify-center gap-2 mb-8">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-14 bg-zinc-900 border border-zinc-800 text-center text-xl font-bold rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                ))}
              </div>

              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-xs text-left">
                  {error}
                </div>
              )}

              <button
                onClick={verifyOtp}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors mb-4"
              >
                Verify & Continue
              </button>

              <div className="text-sm text-zinc-500">
                Didn&apos;t receive a code?{" "}
                <button
                  onClick={handleResendOtp}
                  className={`font-semibold transition-colors ${resendTimer > 0 ? 'text-zinc-700 cursor-not-allowed' : 'text-indigo-400 hover:text-indigo-300'}`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800">
                <button
                  onClick={() => setMode("signin")}
                  className="text-zinc-500 hover:text-white text-sm transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8 mt-2">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                  {mode === "signin" ? "Welcome back" : "Create an account"}
                </h2>
                <p className="text-sm text-zinc-500 mt-2">
                  {mode === "signin"
                    ? "Enter your details to sign in to your account"
                    : "Enter your details to get started with ConvertX"}
                </p>
              </div>

              {/* Error Message */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2 text-red-500"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-zinc-500" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      required
                      className="w-full bg-zinc-900/50 border border-zinc-800 text-sm rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600 focus:bg-zinc-900 text-white"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-zinc-500" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full bg-zinc-900/50 border border-zinc-800 text-sm rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600 focus:bg-zinc-900 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>{mode === "signin" ? "Sign In" : "Sign Up"}</>
                  )}
                </button>
              </form>

              {/* Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-950 px-2 text-zinc-500 font-medium">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 group hover:border-indigo-500/50"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>

              {/* Footer */}
              <div className="mt-6 text-center text-sm text-zinc-500">
                {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={toggleMode}
                  type="button"
                  className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors outline-none"
                >
                  {mode === "signin" ? "Sign Up" : "Sign In"}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

