"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EmailConfirmationCallback() {
  const router = useRouter();

  useEffect(() => {
    // Show success toast
    toast.success("Email confirmed! You are now logged in.");
    // Redirect to login after short delay
    const timeout = setTimeout(() => {
      router.push("/auth/login");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-semibold">Confirming your email...</h2>
    </div>
  );
}
