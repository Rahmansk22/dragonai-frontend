"use client";

import React, { useState, ReactNode } from "react";
import ImagePreview from "./ImagePreview";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

function CodeBlock({ children, inline, className }: any) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    const code = children?.toString() || "";
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return <code className="bg-white/10 px-1.5 sm:px-2 py-0.5 rounded text-xs">{children}</code>;
  }

  return (
    <div className="relative group my-2">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
        title={copied ? "Copied!" : "Copy code"}
      >
        {copied ? (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
      <code className="bg-[#242526]/30 px-2 sm:px-3 py-2 pr-12 rounded block overflow-x-auto text-xs">
        {children}
      </code>
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

  // Move hooks to top level to comply with React rules
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(safeContent);
  const [showEdit, setShowEdit] = useState(false);

  if (role === "user") {
    // User message: keep box, add edit button
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
      <div className="flex justify-end flex-col items-end">
        <div
          className="max-w-full sm:max-w-2xl px-3 sm:px-4 lg:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-accent/30 bg-userbubble text-[#F8FAFC] cursor-pointer text-sm sm:text-base"
          tabIndex={0}
          onClick={() => setShowEdit(true)}
        >
          {isEditing ? (
            <div>
              <textarea
                className="w-full rounded p-2 text-xs sm:text-sm text-black"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleSave} className="px-3 py-1 rounded bg-emerald-600 text-white text-xs">Save</button>
                <button onClick={handleCancel} className="px-3 py-1 rounded bg-gray-400 text-white text-xs">Cancel</button>
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
                className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow transition-colors"
                title="Download image"
              >
                Download Image
              </a>
            </div>
          ) : (
            <div className="text-xs sm:text-sm leading-relaxed prose prose-invert max-w-none break-words overflow-x-auto text-[#F8FAFC]">
              {typeof content === "string" ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-base sm:text-lg font-bold mt-3 mb-2" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-sm sm:text-base font-bold mt-3 mb-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-sm sm:text-base font-semibold mt-2 mb-1" {...props} />,
                    p: ({ node, ...props }) => <span className="mb-2 block" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    code: CodeBlock,
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-indigo-500 pl-2 sm:pl-3 italic my-2 opacity-75" {...props} />
                    ),
                    a: ({ node, ...props }) => <a className="text-indigo-400 underline hover:text-indigo-300 break-all" {...props} />,
                  }}
                >
                  {content}
                </ReactMarkdown>
              ) : content}
            </div>
          )}
        </div>
        {/* Edit button below the box, only show if showEdit is true and not editing */}
        {!isEditing && showEdit && (
          <button
            onClick={handleEdit}
            className="mt-2 px-3 py-1.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-xs text-accent border border-accent/40"
            title="Edit message"
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6v-2a2 2 0 012-2h2v6H3v-2z" />
            </svg>
            Edit
          </button>
        )}
      </div>
    );
  }

  // Assistant message: natural, ChatGPT-like, no box except for code/images
  return (
    <div className="flex justify-start">
      {typeof content === "string" && content.startsWith("http") ? (
        <ImagePreview url={content} />
      ) : typeof content === "string" && content === "[image]" && image ? (
        <div className="flex flex-col items-center">
          <img src={image.startsWith('data:') ? image : `data:image/png;base64,${image}`} alt="User upload" className="rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto my-2 border border-white/20" />
          <a
            href={image.startsWith('data:') ? image : `data:image/png;base64,${image}`}
            download="generated-image.png"
            className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow transition-colors"
            title="Download image"
          >
            Download Image
          </a>
        </div>
      ) : (
        <div className="text-sm sm:text-base leading-relaxed prose prose-invert max-w-2xl break-words overflow-x-auto text-[#E5E7EB]">
          {typeof content === "string" ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-base sm:text-lg font-bold mt-8 mb-6" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-sm sm:text-base font-bold mt-7 mb-5" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-sm sm:text-base font-semibold mt-6 mb-4" {...props} />,
                p: ({ node, ...props }) => <span className="mb-5 block" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-5 space-y-4" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-5 space-y-4" {...props} />,
                li: ({ node, ...props }) => <li className="mb-4" {...props} />,
                code: CodeBlock,
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-indigo-500 pl-2 sm:pl-3 italic my-6 opacity-75" {...props} />
                ),
                a: ({ node, ...props }) => <a className="text-indigo-400 underline hover:text-indigo-300 break-all" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          ) : content}
        </div>
      )}
    </div>
  );
}
