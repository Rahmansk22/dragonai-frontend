
"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232324] via-[#242526] to-[#1a1a1a]">
      
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              card: 'bg-[#232324] border border-white/10 rounded-2xl shadow-xl',
              headerTitle: 'text-cyan-400 text-2xl font-bold',
              headerSubtitle: 'text-white/70',
              formButtonPrimary: 'bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg',
              socialButtonsBlockButton: 'bg-white/10 hover:bg-white/20 text-white',
              footerAction: 'text-white/80',
              logoBox: 'mb-4',
            },
            variables: {
              colorPrimary: '#06b6d4',
              colorBackground: '#232324',
              colorText: '#fff',
              colorInputBackground: '#18181b',
              colorInputText: '#fff',
              colorBorder: '#06b6d4',
            },
          }}
        />
      </div>
 
  );
}
