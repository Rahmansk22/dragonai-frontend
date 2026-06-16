"use client";

import React, { useState, ReactNode } from "react";
import ImagePreview from "./ImagePreview";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

// Client-side regex-based premium syntax highlighter
function highlightCode(code: string, lang: string): React.ReactNode[] {
  const tokens = [
    { type: 'comment', regex: /(\/\/.*|#.*|\/\*[\s\S]*?\*\/)/g },
    { type: 'string', regex: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g },
    { type: 'number', regex: /\b(\d+(?:\.\d+)?)\b/g },
    { type: 'keyword', regex: /\b(const|let|var|function|return|import|export|class|def|if|else|for|while|try|catch|new|public|private|protected|static|void|interface|implements|extends|package|throws|throw|default|switch|case|break|continue|import|from|struct|fn|pub|impl|type|as)\b/g },
    { type: 'builtin', regex: /\b(console|log|System|out|println|String|int|double|float|boolean|char|list|dict|set|print|len|range|map|filter|reduce|Object|null|true|false|undefined)\b/g }
  ];

  const combinedRegex = new RegExp(
    tokens.map(t => `(${t.regex.source})`).join('|'),
    'g'
  );

  const parts = code.split(combinedRegex);
  if (parts.length === 1) return [parts[0] as any];

  const groupSize = tokens.length + 1;
  const result: React.ReactNode[] = [];

  for (let i = 0; i < parts.length; i += groupSize) {
    if (parts[i]) {
      result.push(parts[i]);
    }
    for (let j = 1; j < groupSize; j++) {
      const match = parts[i + j];
      if (match !== undefined) {
        const tokenType = tokens[j - 1].type;
        let colorClass = "";
        if (tokenType === 'keyword') colorClass = "text-[#D4A24F] font-semibold";
        else if (tokenType === 'string') colorClass = "text-emerald-400/95";
        else if (tokenType === 'comment') colorClass = "text-[#A3A69A]/55 italic";
        else if (tokenType === 'number') colorClass = "text-amber-300 font-medium";
        else if (tokenType === 'builtin') colorClass = "text-[#EAD0A3] font-medium";

        result.push(
          <span key={`${i}-${j}`} className={colorClass}>
            {match}
          </span>
        );
        break;
      }
    }
  }

  return result;
}

function CodeBlock({ children, inline, className }: any) {
  const [copied, setCopied] = useState(false);
  const codeText = children?.toString() || "";
  
  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return <code className="bg-white/10 px-1.5 sm:px-2 py-0.5 rounded text-xs font-mono">{children}</code>;
  }

  const language = className ? className.replace("language-", "") : "code";

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-white/5 bg-[#0B0D0F] shadow-2xl premium-glass animate-slide-in">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#14171B]/90 border-b border-white/5">
        <span className="text-[10px] sm:text-xs font-bold text-[#D4A24F] tracking-wider uppercase font-mono">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D4A24F]/10 hover:bg-[#D4A24F]/20 active:bg-[#D4A24F]/30 text-[#D4A24F] text-[10px] sm:text-xs font-semibold transition"
          title="Copy code"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code Area */}
      <pre className="p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-[#F4EFE6]/90 hide-scrollbar">
        <code>{highlightCode(codeText, language)}</code>
      </pre>
    </div>
  );
}

export default function Message({
  role,
  content,
  image,
  onEdit,
}: {
  role: "user" | "assistant";
  content: ReactNode;
  image?: string;
  onEdit?: (newContent: string) => void;
}) {
  const isAI = role === "assistant";
  const safeContent = typeof content === "string" ? content : "";
  const [copiedMessage, setCopiedMessage] = useState(false);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(safeContent);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(safeContent);
  const [showEdit, setShowEdit] = useState(false);

  if (role === "user") {
    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
      setEditValue(safeContent);
      setIsEditing(false);
    };
    const handleSave = () => {
      if (onEdit) onEdit(editValue);
      setIsEditing(false);
    };
    return (
      <div className="flex justify-end flex-col items-end w-full animate-slide-in">
        <div
          className="max-w-[85%] sm:max-w-2xl px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-[#D4A24F]/25 bg-[#14171B]/40 premium-glass-gold text-[#F4EFE6] text-xs sm:text-sm shadow-lg cursor-pointer hover:border-[#D4A24F]/40 transition"
          tabIndex={0}
          onClick={() => setShowEdit(true)}
        >
          {isEditing ? (
            <div>
              <textarea
                className="w-full rounded p-2 text-xs sm:text-sm bg-[#0B0D0F] text-white border border-[#D4A24F]/30 focus:outline-none focus:ring-1 focus:ring-[#D4A24F]"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleSave} className="px-3 py-1 rounded bg-[#D4A24F] text-[#14171B] font-bold text-xs">Save</button>
                <button onClick={handleCancel} className="px-3 py-1 rounded bg-white/10 text-white text-xs">Cancel</button>
              </div>
            </div>
          ) : safeContent.startsWith("http") ? (
            <ImagePreview url={safeContent} />
          ) : safeContent === "[image]" && image ? (
            <div className="flex flex-col items-center">
              <img src={image && image.startsWith('data:') ? image : `data:image/png;base64,${image}`} alt="User upload" className="rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto my-2 border border-white/20" />
              <a
                href={image.startsWith('data:') ? image : `data:image/png;base64,${image}`}
                download="generated-image.png"
                className="mt-2 px-3 py-1.5 rounded-lg bg-[#D4A24F] hover:bg-[#D4A24F]/85 text-[#14171B] text-xs font-bold shadow transition-colors"
                title="Download image"
              >
                Download Image
              </a>
            </div>
          ) : (
            <div className="leading-relaxed prose prose-invert max-w-none break-words overflow-x-auto text-[#F4EFE6]">
              {typeof content === "string" ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-base sm:text-lg font-bold mt-3 mb-2 text-[#D4A24F]" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-sm sm:text-base font-bold mt-3 mb-2 text-[#D4A24F]" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-sm sm:text-base font-semibold mt-2 mb-1 text-[#D4A24F]" {...props} />,
                    p: ({ node, ...props }) => <span className="mb-2 block" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    code: CodeBlock,
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-[#D4A24F] pl-2 sm:pl-3 italic my-2 opacity-75" {...props} />
                    ),
                    a: ({ node, ...props }) => <a className="text-[#D4A24F] underline hover:text-[#D4A24F]/80 break-all" {...props} />,
                  }}
                >
                  {content}
                </ReactMarkdown>
              ) : content}
            </div>
          )}
        </div>
        {!isEditing && showEdit && (
          <button
            onClick={handleEdit}
            className="mt-2 px-3 py-1.5 rounded-lg bg-[#D4A24F]/10 hover:bg-[#D4A24F]/20 text-xs text-[#D4A24F] border border-[#D4A24F]/30 flex items-center gap-1 transition-all"
            title="Edit message"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6v-2a2 2 0 012-2h2v6H3v-2z" />
            </svg>
            Edit
          </button>
        )}
      </div>
    );
  }

  // Assistant message: structured layout with premium gold dragon avatar and clean background text
  return (
    <div className="flex justify-start gap-3 sm:gap-4 items-start w-full max-w-full sm:max-w-3xl animate-slide-in">
      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#D4A24F]/30 bg-[#14171B] flex items-center justify-center flex-shrink-0 shadow-lg mt-0.5 overflow-hidden isolate">
        {/* Dragon image representing Dragon GPT - Zoomed on the face */}
        <img src="/hero_dragon.jpg" alt="Dragon GPT" className="w-full h-full object-cover scale-[1.15] object-center relative z-10" />
      </div>
      <div className="flex-1 text-[#F4EFE6]/95 text-xs sm:text-sm pt-1 sm:pt-2">
        {typeof content === "string" && content.startsWith("http") ? (
          <ImagePreview url={content} />
        ) : typeof content === "string" && content === "[image]" && image ? (
          <div className="flex flex-col items-center">
            <img src={image.startsWith('data:') ? image : `data:image/png;base64,${image}`} alt="User upload" className="rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto my-2 border border-white/20" />
            <a
              href={image.startsWith('data:') ? image : `data:image/png;base64,${image}`}
              download="generated-image.png"
              className="mt-2 px-3 py-1.5 rounded-lg bg-[#D4A24F] hover:bg-[#D4A24F]/85 text-[#14171B] text-xs font-bold shadow transition-colors"
              title="Download image"
            >
              Download Image
            </a>
          </div>
        ) : (
          <div className="leading-relaxed prose prose-invert max-w-none break-words overflow-x-auto text-[#F4EFE6]/90">
            {typeof content === "string" ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-base sm:text-lg font-bold mt-6 mb-4 text-[#D4A24F]" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-sm sm:text-base font-bold mt-5 mb-3 text-[#D4A24F]" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-sm sm:text-base font-semibold mt-4 mb-2 text-[#D4A24F]" {...props} />,
                  p: ({ node, ...props }) => <span className="mb-3 block" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1.5 pl-1" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1.5 pl-1" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                  code: CodeBlock,
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-[#D4A24F] pl-2 sm:pl-3 italic my-4 opacity-75 bg-[#0F1113]/40 py-1 rounded-r-lg" {...props} />
                  ),
                  a: ({ node, ...props }) => <a className="text-[#D4A24F] underline hover:text-[#D4A24F]/80 break-all" {...props} />,
                }}
              >
                {content}
              </ReactMarkdown>
            ) : content}
          </div>
        )}
      </div>
    </div>
  );
}
