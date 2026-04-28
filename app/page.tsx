"use client";

import { ToolCard } from "@/components/ui/tool-card";
import { categories } from "@/lib/data";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, History } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { ConversionHistory } from "@/components/dashboard/conversion-history";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative py-12 flex flex-col items-center text-center space-y-6">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3 h-3" />
            The Future of Web Conversion
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif italic text-white tracking-tight leading-[1.1]"
          >
            Universal <span className="text-zinc-500 underline decoration-indigo-500/50 underline-offset-8">File Converter</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-xl text-zinc-500 text-sm md:text-base leading-relaxed mt-6"
          >
            Fast, secure, and entirely client-side. Convert your images, documents, and assets without ever uploading them to a distant server.
          </motion.p>
        </div>

        {user && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-8"
          >
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all shadow-xl group"
            >
              <History className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-[-20deg]' : 'group-hover:rotate-12'}`} />
              <span className="text-xs font-bold uppercase tracking-widest">
                {showHistory ? 'Hide My History' : 'View Conversion History'}
              </span>
            </button>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {user && showHistory && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ConversionHistory />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Categories / Other Tools */}
      {categories.map((category) => (
        <section key={category.title} className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="font-serif italic text-2xl sm:text-3xl text-white tracking-tight">
              {category.title}
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {category.tools.map((tool) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                colorClass={tool.colorClass}
                hoverBorderClass={tool.hoverBorderClass}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
