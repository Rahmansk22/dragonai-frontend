import { useEffect } from "react";
import { useRouter } from "next/navigation";


/**
 * useRequireClerkProfile - React hook to enforce Clerk profile setup before accessing a page.
 *
 * Usage: Call this at the top of any protected page (e.g., /chat) to redirect to /profile-setup if Clerk profile is missing.
 */
export function useRequireClerkProfile() {
  // No-op: Clerk removed
}
