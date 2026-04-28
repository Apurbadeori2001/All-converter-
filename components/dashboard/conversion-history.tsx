"use client";

import { useEffect, useState } from "react";
import { 
  FileText, 
  Image as ImageIcon, 
  FileJson, 
  Download, 
  History, 
  Loader2,
  Clock,
  ExternalLink,
  ChevronRight,
  Search,
  LayoutGrid,
  List
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getUserConversions, ConversionRecord } from "@/lib/conversions";
import { format } from "date-fns";

const getFileTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'image': return ImageIcon;
    case 'pdf': return FileText;
    case 'document': return FileText;
    default: return FileJson;
  }
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function ConversionHistory() {
  const [conversions, setConversions] = useState<ConversionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getUserConversions();
        setConversions(data || []);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-zinc-900/50 rounded-2xl animate-pulse border border-zinc-800" />
        ))}
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 px-6 bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[2rem] space-y-6"
      >
        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto text-zinc-500 shadow-inner">
          <History className="w-8 h-8 opacity-20" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">No conversions yet</h3>
          <p className="text-zinc-500 text-sm max-w-xs mx-auto leading-relaxed">
            Start transforming your media. Your conversion history will appear right here.
          </p>
        </div>
        <button className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] hover:text-indigo-300 transition-colors">
          Start Converting
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-sm">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity</h2>
            <p className="text-xs text-zinc-500 font-medium">{conversions.length} items found</p>
          </div>
        </div>
        
        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <button 
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView('grid')}
            className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={view === 'list' ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
        <AnimatePresence mode="popLayout">
          {conversions.map((item, index) => {
            const Icon = getFileTypeIcon(item.fileType);
            const date = item.timestamp?.toDate ? item.timestamp.toDate() : new Date();
            
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative overflow-hidden bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all rounded-2xl backdrop-blur-sm
                  ${view === 'list' ? 'p-4 flex items-center gap-4' : 'p-6 flex flex-col gap-4'}`}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                
                <div className={`shrink-0 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all shadow-inner
                  ${view === 'list' ? 'w-12 h-12' : 'w-14 h-14'}`}>
                  <Icon className={view === 'list' ? 'w-6 h-6' : 'w-7 h-7'} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate pr-4 group-hover:text-indigo-100 transition-colors">
                    {item.originalFileName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase tracking-wider">
                      {item.fromFormat}
                    </span>
                    <ChevronRight className="w-3 h-3 text-zinc-700" />
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                      {item.toFormat}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono ml-2 opacity-60">
                      {formatBytes(item.fileSize)}
                    </span>
                  </div>
                </div>

                <div className={`flex items-center gap-6 ${view === 'grid' ? 'justify-between mt-4' : ''}`}>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.1em] flex items-center justify-end gap-1.5">
                      <Clock className="w-3 h-3" />
                      {format(date, 'MMM d, p')}
                    </span>
                  </div>

                  <button className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700 hover:bg-zinc-900 transition-all shadow-lg active:scale-95 group/btn relative overflow-hidden">
                    <Download className="w-4 h-4 relative z-10" />
                    <div className="absolute inset-0 bg-indigo-500/10 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
