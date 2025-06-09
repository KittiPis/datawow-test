import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ❗️ใช้เฉพาะชั่วคราวเท่านั้น อย่าใช้ใน production ถ้าไม่จำเป็น
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
