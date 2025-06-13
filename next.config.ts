import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    domains:["dnbzrptjoujvzvjzzkoo.supabase.co"],
  }
};

export default nextConfig;
// Optional: fallback to client-only rendering for dynamic routes
export const dynamic = "force-dynamic";
