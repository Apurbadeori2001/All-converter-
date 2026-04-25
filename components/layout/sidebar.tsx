"use client";

import Link from "next/link";
import { LayoutDashboard, Clock, Star, X } from "lucide-react";
import { categories } from "@/lib/data";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Close sidebar on route change on mobile
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 lg:w-60 border-r border-zinc-800/50 bg-zinc-950 p-6 flex flex-col gap-8 flex-shrink-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between lg:hidden mb-2">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
               C
             </div>
             <span className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
               ConvertX
             </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg hover:bg-zinc-800 text-zinc-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5 overflow-y-auto flex-1 hide-scrollbar -mx-2 px-2 pb-4">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600 mb-4 lg:mt-0">
            Main Menu
          </p>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg text-sm font-medium border border-indigo-500/20"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium hover:bg-zinc-800/30 rounded-lg"
          >
            <Clock className="w-4 h-4" />
            Recent Files
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium hover:bg-zinc-800/30 rounded-lg"
          >
            <Star className="w-4 h-4" />
            Favorites
          </Link>

          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600 mb-4 mt-8">
            Categories
          </p>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.title}
                className="w-full flex items-center justify-between px-3 py-2 text-zinc-400 hover:text-white text-sm hover:bg-zinc-800/30 rounded-lg transition-colors group"
              >
                <span>{category.title.split(" ")[0]} Tools</span>
                <span className="text-[10px] bg-zinc-800/50 group-hover:bg-zinc-700 px-1.5 py-0.5 rounded text-zinc-300">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 shrink-0">
          <div className="p-4 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 border border-indigo-500/20 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-xs font-semibold text-white mb-1 relative z-10">Pro Membership</p>
            <p className="text-[10px] text-zinc-400 mb-3 relative z-10">
              Unlimited conversions & batch processing.
            </p>
            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg transition-colors relative z-10 cursor-pointer shadow-lg shadow-indigo-900/50">
              UPGRADE NOW
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
