"use client";

import { useState } from "react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { useAuth } from "@/lib/AuthContext";
import { VerificationScreen } from "../auth/VerificationScreen";
import { AuthModal } from "../auth/AuthModal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, isVerified, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#09090b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is logged in but not verified, show verification screen instead of content
  if (user && !isVerified) {
    return (
      <div className="h-screen w-full bg-[#09090b] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <VerificationScreen 
            email={user.email || ""} 
            onLoginClick={async () => {
              await signOut();
              setAuthModalOpen(true);
            }} 
          />
          <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#09090b] text-zinc-100 font-sans overflow-hidden flex flex-col relative selection:bg-indigo-500/30">
      {/* Subtle Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/10 sm:bg-indigo-900/20 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-900/10 sm:bg-violet-900/20 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />

      {/* Sticky Top Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden relative z-10 w-full h-full">
        {/* Sidebar component is now managing its own mobile overlay and drawer state */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col h-full bg-zinc-900/10 relative z-0">
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-8 max-w-6xl mx-auto">
              {children}
            </div>
          </main>
          
          {/* Status Bar / Footer */}
          <footer className="h-8 py-1 border-t border-zinc-800/50 bg-zinc-950 px-4 sm:px-8 flex items-center justify-between text-[9px] sm:text-[10px] text-zinc-500 shrink-0 uppercase tracking-widest font-medium z-10 w-full overflow-x-auto whitespace-nowrap hide-scrollbar">
            <div className="flex gap-4 sm:gap-6 items-center">
              <span>Version 2.4.0-build</span>
              <span className="hidden sm:inline">|</span>
              <span className="flex items-center gap-1.5">
                Status: <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span> <span className="text-emerald-500">Operational</span>
              </span>
            </div>
            <div className="flex gap-4 sm:gap-6 items-center">
              <span className="hidden sm:inline">Storage: 4.2GB / 10GB</span>
              <span className="hidden sm:inline">|</span>
              <span>Cloud Sync Enabled</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
