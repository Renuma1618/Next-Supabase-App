"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@/lib/SupabaseClient";
import { myAppHook } from "@/context/AppUtils";

export default function CallbackPage() {
  const router = useRouter();
  const { setIsLoggedIn, setAuthToken } = myAppHook();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const errorCode = hashParams.get("error_code");

        if (errorCode === "otp_expired") {
          toast.error("The confirmation link has expired. Please log in again.");
        } else if (hashParams.get("error") === "access_denied") {
          toast.success("Email already confirmed. Please log in.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }

        // Redirect to login page after short delay
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000); // 2 seconds
        return;
      }

      // ✅ Session is valid: user confirmed via email
      setAuthToken(data.session.access_token);
      localStorage.setItem("authToken", data.session.access_token);
      setIsLoggedIn(true);
      toast.success("Successfully logged in!");
      router.push("/auth/dashboard");
    };

    processCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg">
      {loading && <p>Processing authentication...</p>}
    </div>
  );
}
