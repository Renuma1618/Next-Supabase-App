    "use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/SupabaseClient";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { myAppHook } from "@/context/AppUtils";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface UserType {
  email: string;
  password: string;
}

const formSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password required"),
});

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, setAuthToken } = myAppHook();
   const [emailConfirmed, setEmailConfirmed] = useState(false); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/auth/dashboard"); // redirect to dashboard if already logged in
    }
  }, [isLoggedIn]);

  const handleSocialOauth = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/dashboard`, 
      },
    });
    if (error) {
      toast.error("Error during OAuth sign-in");
    }

  };

  const onSubmit = async (formdata: UserType) => {
    const { email, password } = formdata;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        toast("Please confirm your email. Check your inbox for the confirmation link.");
      } else {
        toast.error("Failed to login: " + error.message);
      }
      return;
    }

    if (data.session?.access_token) {
      setAuthToken(data.session.access_token);
      localStorage.setItem("authToken", data.session.access_token);
      setIsLoggedIn(true);
      toast.success("Logged in successfully");
      router.push("/auth/dashboard");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;

      if (hash.includes("type=signup") || hash.includes("access_token")) {
        setEmailConfirmed(true); // ← SET the flag
        // Don't redirect or replace state
      }

      if (hash.includes("error=access_denied")) {
        toast.error("Email confirmation link is invalid or expired.");
        // Optional: set an error flag if needed
      }
    }
  }, []);

  {emailConfirmed && (
  <div className="alert alert-success text-center">
    ✅ Your email is confirmed. You can now log in.
  </div>
)}



  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="w-50 mx-auto mt-3">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" {...register("email")} />
            <p className="text-danger">{errors.email?.message}</p>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" {...register("password")} />
            <p className="text-danger">{errors.password?.message}</p>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <button className="btn btn-danger mx-2" onClick={() => handleSocialOauth("google")}>
            Google
          </button>
          <button className="btn btn-dark mx-2" onClick={() => handleSocialOauth("github")}>
            GitHub
          </button>
        </div>

        <p className="text-center mt-3">
          Dont have an account? <a href="/auth/register">Register</a>
        </p>
      </div>
      <Footer />
    </>
  );
}
