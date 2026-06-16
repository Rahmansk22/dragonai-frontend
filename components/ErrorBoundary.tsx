"use client";
import React from "react";

// Simple error boundary for client components
export class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    // Log error to service if needed
    // console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#18191A] p-4">
          <div className="bg-[#232324] border border-red-500/40 rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
            <h1 className="text-2xl font-extrabold text-red-400 mb-4">Something went wrong</h1>
            <div className="text-white/80 mb-2">An unexpected error occurred. Please try refreshing the page.</div>
            <div className="text-xs text-red-300 break-all">{String(this.state.error)}</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
