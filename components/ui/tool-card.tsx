"use client";

import { createElement } from "react";
import { type LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  hoverBorderClass: string;
}

export function ToolCard({ title, description, icon, colorClass, hoverBorderClass }: ToolCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-xl hover:bg-zinc-800/50 transition-colors cursor-pointer group ${hoverBorderClass} shadow-sm hover:shadow-md`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-8 h-8 rounded-lg flex flex-shrink-0 items-center justify-center transition-transform group-hover:scale-110 ${colorClass}`}
        >
          {createElement(icon, { className: "w-4 h-4" })}
        </div>
        <h3 className="text-sm font-semibold text-zinc-100 truncate pr-2">{title}</h3>
      </div>
      <p className="text-[11px] text-zinc-500 leading-relaxed mt-1 line-clamp-2">
        {description}
      </p>
    </motion.div>
  );
}
