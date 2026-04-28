"use client";

import { use } from "react";
import { categories } from "@/lib/data";
import { ImageConverter } from "@/components/converter/image-converter";
import { WordToPdfConverter } from "@/components/converter/word-to-pdf-converter";
import { motion } from "motion/react";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Find the tool in categories
  const tool = categories
    .flatMap(c => c.tools)
    .find(t => t.id === id);

  if (!tool) {
    notFound();
  }

  // Determine if it's an image tool
  const isImageTool = categories.find(c => c.title === "Image Tools")?.tools.some(t => t.id === id);
  const isWordToPdf = id === "word-to-pdf";

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Tools</span>
      </Link>

      <div className="flex flex-col items-center text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${tool.colorClass} border-current/20`}
        >
          <Sparkles className="w-3 h-3" />
          {tool.title}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-serif italic text-white tracking-tight"
        >
          {tool.title}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl text-zinc-500 text-sm leading-relaxed"
        >
          {tool.description}
        </motion.p>
      </div>

      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 rounded-[2rem] blur-2xl opacity-50" />
        <div className="relative">
          {isImageTool ? (
            <ImageConverter />
          ) : isWordToPdf ? (
            <WordToPdfConverter />
          ) : (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-20 text-center space-y-4 backdrop-blur-sm">
              <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-zinc-500 mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{tool.title} is Coming Soon</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                We&apos;re currently building out the specific logic for this {tool.id.includes('pdf') ? 'PDF' : 'specialized'} tool. 
                Stay tuned for updates!
              </p>
              <Link href="/" className="inline-block mt-4 text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest text-[10px]">
                Explore Available Tools
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
