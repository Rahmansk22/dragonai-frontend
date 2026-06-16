"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../lib/clerk";

export default function ChatAuthGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;
  if (!isSignedIn) return null;
  return <>{children}</>;
}
