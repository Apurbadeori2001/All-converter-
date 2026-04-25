import {
  FileImage,
  Wand2,
  Minimize,
  Ruler, // or Crop
  FileText,
  Link as LinkIcon,
  Unlock,
  Presentation,
  Music,
  RefreshCcw, // For Video to GIF
  FileCode2,
  Hash,
  Video,
  FileArchive,
  Image as ImageIcon,
  Scissors
} from 'lucide-react';

export const categories = [
  {
    title: "Image Tools",
    count: 12,
    tools: [
      {
        id: "png-to-jpg",
        title: "PNG to JPG / JPG to PNG",
        description: "Convert transparent PNGs to optimized JPEG images.",
        icon: ImageIcon,
        colorClass: "text-indigo-400 bg-indigo-500/10",
        hoverBorderClass: "hover:border-indigo-500/40"
      },
      {
        id: "bg-remover",
        title: "Background Remover",
        description: "Remove backgrounds from any image automatically.",
        icon: Wand2,
        colorClass: "text-emerald-400 bg-emerald-500/10",
        hoverBorderClass: "hover:border-emerald-500/40"
      },
      {
        id: "image-compressor",
        title: "Image Compressor",
        description: "Reduce file size without losing image quality.",
        icon: Minimize,
        colorClass: "text-orange-400 bg-orange-500/10",
        hoverBorderClass: "hover:border-orange-500/40"
      },
      {
        id: "image-resizer",
        title: "Image Resizer",
        description: "Change dimensions for social media posts.",
        icon: Ruler,
        colorClass: "text-sky-400 bg-sky-500/10",
        hoverBorderClass: "hover:border-sky-500/40"
      },
      {
        id: "heic-to-jpg",
        title: "HEIC to JPG",
        description: "Convert Apple HEIC photos to standard JPG format.",
        icon: FileImage,
        colorClass: "text-rose-400 bg-rose-500/10",
        hoverBorderClass: "hover:border-rose-500/40"
      },
      {
        id: "webp-png",
        title: "WEBP to PNG",
        description: "Convert modern WEBP images to standard PNG format.",
        icon: RefreshCcw,
        colorClass: "text-fuchsia-400 bg-fuchsia-500/10",
        hoverBorderClass: "hover:border-fuchsia-500/40"
      },
      {
        id: "svg-converter",
        title: "SVG Converter",
        description: "Convert vectors to raster images or vice versa.",
        icon: FileCode2,
        colorClass: "text-blue-400 bg-blue-500/10",
        hoverBorderClass: "hover:border-blue-500/40"
      },
      {
        id: "image-to-pdf",
        title: "Image to PDF",
        description: "Combine multiple images into a single PDF document.",
        icon: FileText,
        colorClass: "text-red-400 bg-red-500/10",
        hoverBorderClass: "hover:border-red-500/40"
      }
    ]
  },
  {
    title: "Document Tools",
    count: 8,
    tools: [
      {
        id: "word-to-pdf",
        title: "Word to PDF",
        description: "Transform DOCX and DOC files into clean PDF format.",
        icon: FileText,
        colorClass: "text-blue-400 bg-blue-500/10",
        hoverBorderClass: "hover:border-blue-500/40"
      },
      {
        id: "excel-to-pdf",
        title: "Excel to PDF",
        description: "Convert spreadsheets to easily shareable PDFs.",
        icon: FileText, // Could use specific icons if needed
        colorClass: "text-emerald-400 bg-emerald-500/10",
        hoverBorderClass: "hover:border-emerald-500/40"
      },
      {
        id: "ppt-to-pdf",
        title: "PowerPoint to PDF",
        description: "Export PowerPoint slides to clean PDF pages.",
        icon: Presentation,
        colorClass: "text-amber-400 bg-amber-500/10",
        hoverBorderClass: "hover:border-amber-500/40"
      },
      {
        id: "merge-pdf",
        title: "Merge PDF",
        description: "Combine multiple PDF documents into one.",
        icon: LinkIcon,
        colorClass: "text-violet-400 bg-violet-500/10",
        hoverBorderClass: "hover:border-violet-500/40"
      },
      {
        id: "split-pdf",
        title: "Split PDF",
        description: "Extract specific pages or split PDF into multiple files.",
        icon: Scissors,
        colorClass: "text-pink-400 bg-pink-500/10",
        hoverBorderClass: "hover:border-pink-500/40"
      },
      {
        id: "compress-pdf",
        title: "Compress PDF",
        description: "Reduce PDF file size while maintaining readability.",
        icon: FileArchive,
        colorClass: "text-orange-400 bg-orange-500/10",
        hoverBorderClass: "hover:border-orange-500/40"
      },
      {
        id: "txt-to-pdf",
        title: "TXT to PDF",
        description: "Convert plain text files into formatted PDFs.",
        icon: FileText,
        colorClass: "text-zinc-400 bg-zinc-500/10",
        hoverBorderClass: "hover:border-zinc-500/40"
      },
      {
        id: "protect-unlock-pdf",
        title: "Protect/Unlock PDF",
        description: "Add passwords or remove restrictions from PDF files.",
        icon: Unlock,
        colorClass: "text-rose-400 bg-rose-500/10",
        hoverBorderClass: "hover:border-rose-500/40"
      }
    ]
  },
  {
    title: "Media Tools",
    count: 4,
    tools: [
      {
        id: "mp4-to-mp3",
        title: "MP4 to MP3",
        description: "Extract high-quality audio from video files.",
        icon: Music,
        colorClass: "text-pink-400 bg-pink-500/10",
        hoverBorderClass: "hover:border-pink-500/40"
      },
      {
        id: "video-to-gif",
        title: "Video to GIF",
        description: "Create animated GIFs from short video clips.",
        icon: Video,
        colorClass: "text-cyan-400 bg-cyan-500/10",
        hoverBorderClass: "hover:border-cyan-500/40"
      },
      {
        id: "video-compressor",
        title: "Video Compressor",
        description: "Reduce video file size for easier sharing.",
        icon: Minimize,
        colorClass: "text-indigo-400 bg-indigo-500/10",
        hoverBorderClass: "hover:border-indigo-500/40"
      },
      {
        id: "audio-converter",
        title: "Audio Converter",
        description: "Convert between WAV, OGG, and MP3 formats.",
        icon: Music,
        colorClass: "text-emerald-400 bg-emerald-500/10",
        hoverBorderClass: "hover:border-emerald-500/40"
      }
    ]
  },
  {
    title: "Developer Tools",
    count: 4,
    tools: [
      {
        id: "json-to-csv",
        title: "JSON to CSV",
        description: "Format raw JSON data into tabular CSV files.",
        icon: FileCode2,
        colorClass: "text-zinc-100 bg-zinc-800",
        hoverBorderClass: "hover:border-zinc-500/40"
      },
      {
        id: "xml-to-json",
        title: "XML to JSON",
        description: "Convert XML documents into readable JSON objects.",
        icon: FileCode2,
        colorClass: "text-sky-400 bg-sky-500/10",
        hoverBorderClass: "hover:border-sky-500/40"
      },
      {
        id: "base64",
        title: "Base64 Encoder",
        description: "Encode or decode text and files using Base64.",
        icon: Hash,
        colorClass: "text-violet-400 bg-violet-500/10",
        hoverBorderClass: "hover:border-violet-500/40"
      },
      {
        id: "md-to-html",
        title: "MD to HTML",
        description: "Convert Markdown syntax to production HTML.",
        icon: Hash,
        colorClass: "text-zinc-100 bg-zinc-800",
        hoverBorderClass: "hover:border-zinc-500/40"
      }
    ]
  }
];
