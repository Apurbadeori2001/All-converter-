"use client";

import { CheckCircle2 } from "lucide-react";

interface VerificationScreenProps {
  email: string;
  onLoginClick: () => void;
}

export function VerificationScreen({ email, onLoginClick }: VerificationScreenProps) {
  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-4">Check your email</h2>
      <p className="text-zinc-400 text-sm leading-relaxed mb-8">
        We have sent you a verification email to <span className="text-white font-medium">{email}</span>. Please verify it and log in.
      </p>
      <button
        onClick={onLoginClick}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-900/20"
      >
        Login
      </button>
    </div>
  );
}
