"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, 
  X, 
  Download, 
  Loader2,
  CheckCircle2,
  FileText,
  AlertCircle,
  FileDown
} from "lucide-react";
import mammoth from "mammoth";
import { jsPDF } from "jspdf";
import { saveConversionHistory } from "@/lib/conversions";

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function WordToPdfConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setConvertedUrl(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024
  });

  const removeFile = () => {
    setFile(null);
    setConvertedUrl(null);
    setConverting(false);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file) return;
    setConverting(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Extract text content from Word using Mammoth
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;
      
      if (!text.trim()) {
        throw new Error("The document appears to be empty or contains unsupported content.");
      }

      // Create PDF using jsPDF
      const doc = new jsPDF();
      
      // Split text into lines that fit the page width
      const splitText = doc.splitTextToSize(text, 180);
      
      // Add lines to PDF, handling page breaks
      let y = 10;
      splitText.forEach((line: string) => {
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, 10, y);
        y += 7;
      });

      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      
      setConvertedUrl(url);
      const newFileName = file.name.replace(/\.(docx|doc)$/i, '.pdf');
      setResultFileName(newFileName);

      // Save to history
      await saveConversionHistory({
        originalFileName: file.name,
        convertedFileName: newFileName,
        fileType: "PDF",
        fileSize: file.size,
        fromFormat: file.name.split('.').pop() || "unknown",
        toFormat: "pdf"
      });
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to convert document. Please ensure it is a valid .docx file.");
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
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white tracking-tight">
                      Drop your Word document here
                    </h3>
                    <p className="text-zinc-500 text-sm">
                      or <span className="text-indigo-400 font-medium">Click to Browse</span>
                    </p>
                  </div>
                  <div className="flex gap-4 mt-4">
                    {['DOCX', 'DOC'].map(fmt => (
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
            {/* File Info Card */}
            <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
              
              <div className="flex items-center gap-6">
                <div className="relative w-16 h-16 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-indigo-400">
                  <FileText className="w-8 h-8" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-white truncate">{file.name}</h4>
                  <p className="text-xs text-zinc-500 font-mono tracking-tight">{formatBytes(file.size)}</p>
                </div>

                {!converting && !convertedUrl && (
                  <button 
                    onClick={removeFile}
                    className="p-3 bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-500/30 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {!convertedUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-6 text-center"
              >
                <div className="space-y-2">
                  <h5 className="text-sm font-bold text-white uppercase tracking-wider">Ready to Convert</h5>
                  <p className="text-xs text-zinc-500">Your document will be processed locally and converted to a PDF file.</p>
                </div>

                {error && (
                   <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center gap-3 text-red-500 text-xs text-center">
                     <AlertCircle className="w-4 h-4 shrink-0" />
                     <p className="font-medium">{error}</p>
                   </div>
                )}

                <button
                  onClick={handleConvert}
                  disabled={converting}
                  className="w-full relative group overflow-hidden py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-[0.2em] uppercase transition-all disabled:opacity-50 shadow-lg"
                >
                  <div className="flex items-center justify-center gap-3 text-sm">
                    {converting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-5 h-5" />
                        <span>Convert to PDF</span>
                      </>
                    )}
                  </div>
                </button>
              </motion.div>
            )}

            {convertedUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 shadow-lg" />
                
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">PDF Generated!</h3>
                  <p className="text-zinc-500 text-sm">Your file is ready for download.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                   <a
                    href={convertedUrl}
                    download={resultFileName}
                    className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                  
                  <button
                    onClick={removeFile}
                    className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-white font-bold uppercase tracking-widest text-xs transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    New Document
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
