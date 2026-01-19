
"use client";

import ChatPageClient from "./ChatPageClient";
import { ToastProvider } from "../../components/ToastProvider";
import ChatAuthGuard from "./ChatAuthGuard";

export default function Page() {
  return (
    <ToastProvider>
      <ChatAuthGuard>
        <ChatPageClient />
      </ChatAuthGuard>
    </ToastProvider>
  );
}
