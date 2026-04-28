"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, 
  X, 
  ArrowRight, 
  Download, 
  Loader2,
  CheckCircle2,
  Settings2,
  AlertCircle
} from "lucide-react";
import Image from "next/image";
import { saveConversionHistory } from "@/lib/conversions";

// Helper to format bytes
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.8);
  const [converting, setConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setConvertedUrl(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setConvertedUrl(null);
    setConverting(false);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file || !preview) return;
    setConverting(true);
    setError(null);

    try {
      const img = document.createElement("img");
      img.src = preview;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Could not get canvas context");
      
      // Draw white background for transparency conversion if necessary (e.g. to JPEG)
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), targetFormat, quality);
      });

      if (!blob) throw new Error("Conversion failed");

      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);
      
      const extension = targetFormat.split("/")[1].replace("jpeg", "jpg");
      const name = file.name.split(".")[0];
      const newFileName = `${name}-convertx.${extension}`;
      setResultFileName(newFileName);

      // Save to history
      await saveConversionHistory({
        originalFileName: file.name,
        convertedFileName: newFileName,
        fileType: "Image",
        fileSize: file.size,
        fromFormat: file.name.split('.').pop() || "unknown",
        toFormat: extension
      });
      
    } catch (err) {
      console.error(err);
      setError("Failed to convert image. Please try a different file.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group cursor-pointer"
          >
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <motion.div
                animate={{
                  borderColor: isDragActive ? "rgba(99, 102, 241, 1)" : "rgba(39, 39, 42, 0.5)",
                  backgroundColor: isDragActive ? "rgba(99, 102, 241, 0.05)" : "rgba(24, 24, 27, 0.5)",
                }}
                className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 backdrop-blur-sm
                  ${isDragActive ? "shadow-[0_0_40px_rgba(99,102,241,0.1)] border-indigo-500 scale-[1.02]" : "hover:border-zinc-700 hover:bg-zinc-900/50"}`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-500 shadow-inner">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white tracking-tight">
                      Drag & Drop your files here
                    </h3>
                    <p className="text-zinc-500 text-sm">
                      or <span className="text-indigo-400 font-medium">Click to Browse</span>
                    </p>
                  </div>
                  <div className="flex gap-4 mt-4">
                    {['JPG', 'PNG', 'WEBP', 'HEIC'].map(fmt => (
                      <span key={fmt} className="text-[10px] font-mono font-bold px-2 py-1 bg-zinc-800/50 text-zinc-500 rounded border border-zinc-700/50 uppercase tracking-widest">
                        {fmt}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-4 uppercase tracking-[0.2em] font-bold">
                    Up to 50MB
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* File Preview Card */}
            <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-inner group-hover:rotate-1 transition-transform duration-500">
                  {preview && (
                    <Image 
                      src={preview} 
                      alt="Preview" 
                      fill 
                      className="object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                
                <div className="flex-1 space-y-1 text-center md:text-left overflow-hidden">
                  <h4 className="text-lg font-bold text-white truncate w-full">{file.name}</h4>
                  <p className="text-xs text-zinc-500 font-mono tracking-tight">{formatBytes(file.size)}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-2 font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase font-bold tracking-wider">
                      {file.type.split('/')[1] || 'FILE'}
                    </span>
                  </div>
                </div>

                {!converting && !convertedUrl && (
                  <button 
                    onClick={removeFile}
                    className="p-3 bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-500/30 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Conversion Controls */}
            {!convertedUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-8 backdrop-blur-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Settings2 className="w-4 h-4 text-indigo-400" />
                  <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Conversion Settings</h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Format Selection */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-zinc-300 flex items-center gap-2 uppercase tracking-tight">
                      Target Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['image/jpeg', 'image/png', 'image/webp'].map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setTargetFormat(fmt)}
                          className={`py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all ${
                            targetFormat === fmt 
                              ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/40" 
                              : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900"
                          }`}
                        >
                          {fmt.split('/')[1]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-zinc-300 uppercase tracking-tight">Quality</label>
                      <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded border border-indigo-400/20">{Math.round(quality * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1.0" 
                      step="0.05"
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all border border-zinc-700/50"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-500 font-bold uppercase tracking-widest opacity-60">
                      <span>Compressed</span>
                      <span>Lossless</span>
                    </div>
                  </div>
                </div>

                {error && (
                   <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs">
                     <AlertCircle className="w-4 h-4 shrink-0" />
                     <p className="font-medium tracking-tight">{error}</p>
                   </div>
                )}

                <button
                  onClick={handleConvert}
                  disabled={converting}
                  className="w-full relative group overflow-hidden py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-[0.2em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.4)] active:scale-[0.98]"
                >
                  <div className="flex items-center justify-center gap-3 relative z-10 text-sm">
                    {converting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Converting Process...</span>
                      </>
                    ) : (
                      <>
                        <span>Convert Now</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                  <div className="absolute inset-x-0 h-full w-24 bg-white/20 blur-xl -skew-x-12 translate-x-[-200%] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out" />
                </button>
              </motion.div>
            )}

            {/* Result Card */}
            {convertedUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-xl"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-inner">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Conversion Complete!</h3>
                  <p className="text-zinc-500 text-sm font-medium">Your file is optimized and ready.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                   <a
                    href={convertedUrl}
                    download={resultFileName}
                    className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </a>
                  
                  <button
                    onClick={removeFile}
                    className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-white font-bold uppercase tracking-widest text-xs transition-all active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    Convert Another
                  </button>
                </div>
                
                <div className="pt-4 flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-zinc-800"></div>
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{targetFormat.split('/')[1]} output</span>
                  <div className="h-px flex-1 bg-zinc-800"></div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
