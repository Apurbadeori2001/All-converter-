"use client";

import { ToolCard } from "@/components/ui/tool-card";
import { categories } from "@/lib/data";

export default function Home() {
  return (
    <div className="space-y-12 pb-12">
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
