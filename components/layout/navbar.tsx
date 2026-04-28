"use client";

import { useState } from "react";
import { Search, Menu, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, loading, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await signOut();
    // Re-open modal to simulate "returning to auth screen"
    openAuth("signin");
  };

  return (
    <>
      <nav className="h-16 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 z-40 shrink-0 sticky top-0 w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            C
          </div>
          <span className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 hidden sm:inline-block">
            ConvertX
          </span>
        </div>

        <div className="flex-1 max-w-md px-4 sm:px-12 flex justify-end lg:justify-center">
          <div className="relative group w-full max-w-xs sm:max-w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search tools..."
              className="w-full bg-zinc-900/50 border border-zinc-800 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600 focus:bg-zinc-900 text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 pl-2">
          {loading ? (
            <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 cursor-pointer p-1 rounded-full hover:bg-zinc-800/50 transition-colors">
                <span className="text-sm font-medium text-zinc-400 hidden sm:inline-block">
                  {user.email?.split("@")[0] || "User"}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 p-[1px] overflow-hidden">
                  <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {(user.email || "U").charAt(0)}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuth("signin")}
                className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium rounded-lg transition-colors"
                title="Sign In"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth("signup")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-900/20"
                title="Sign Up"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {authModalOpen && (
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
          initialMode={authMode}
        />
      )}
    </>
  );
}
