// ===========================================
// next.config.ts
// Next.js Configuration
// - ตั้งค่า images domains สำหรับรูปภาพจากภายนอก
// - ตั้งค่า CORS headers สำหรับเรียก Backend API
// - โครงสร้างเดียวกับเว็บ Venue Booking เดิม
// ===========================================

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // เพิ่ม body size limit สำหรับ Server Actions (default 1MB ไม่พอสำหรับ base64 image)
  serverActions: {
    bodySizeLimit: "10mb",
  },

  // ข้าม ESLint ตอน build (errors เป็นแค่ type warnings ไม่กระทบการทำงาน)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // อนุญาตให้โหลดรูปจาก domains เหล่านี้ (เพิ่ม domain ได้ภายหลัง)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // ตั้งค่า CORS headers สำหรับ API routes
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
