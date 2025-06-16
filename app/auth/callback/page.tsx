"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/SupabaseClient";
import { myAppHook } from "@/context/AppUtils";
import toast from "react-hot-toast";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setIsLoggedIn, setAuthToken } = myAppHook();

  useEffect(() => {
    const handleAuth = async () => {
      // Get the code from the URL query string
      const code = new URLSearchParams(window.location.search).get("code");
      const { data, error } = await supabase.auth.exchangeCodeForSession(code as string); // Pass code as argument

      if (error) {
        toast.error("Email link is invalid or expired.");
        router.push("/auth/login");
        return;
      }

      const session = data?.session;
      if (session) {
        setAuthToken(session.access_token);
        localStorage.setItem("authToken", session.access_token);
        setIsLoggedIn(true);

        toast.success("Email confirmed and successfully logged in!");
        router.push("/auth/dashboard");
      } else {
        toast.error("Something went wrong. Please try again.");
        router.push("/auth/login");
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Verifying email and logging in...</p>
    </div>
  );
}
