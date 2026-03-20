// ===========================================
// src/components/HotelCard.tsx
// Hotel Card — Redesigned v2
// - รูปภาพ (ด้านบน)
// - ชื่อ hotel
// - ดาว rating (1-5)
// - description ใต้ดาว
// - ไม่มี badge ทับรูป
// ===========================================

"use client";
import { useAppSelector } from "@/redux/store";
import { getHotelMeta } from "@/redux/features/bookSlice";
import StarRating from "@/components/StarRating";

export default function HotelCard({
  hotelId,
  hotelName,
  imgSrc,
  hotelRating,
  hotelDescription,
}: {
  hotelId: string;
  hotelName: string;
  imgSrc?: string;
  hotelRating?: number | null;
  hotelDescription?: string | null;
}) {
  const hotelMetaStore = useAppSelector((state) => state.bookSlice.hotelMeta);
  const meta = getHotelMeta(hotelMetaStore, hotelId, hotelName);

  const defaultImages = ["/img/hotel.jpg", "/img/hotel2.jpg", "/img/hotel3.jpg"];
  const imageIndex = hotelName.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) % defaultImages.length;
  // meta.picture (Redux) takes priority over server imgSrc, then falls back to default
  const displayImage = imgSrc || meta.picture || defaultImages[imageIndex];
  const displayRating = hotelRating ?? meta.rating;
  const displayDescription = hotelDescription ?? meta.description;

  return (
    <div className="w-full max-w-[340px] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_16px_50px_rgba(220,183,113,0.12)] cursor-pointer group border border-white/[0.04]">
      {/* ===== รูปภาพ — ไม่มี badge ทับ ===== */}
      <div className="relative w-full h-[200px] sm:h-[210px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayImage}
          alt={hotelName}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          className="group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* ===== ข้อมูล ===== */}
      <div className="p-4 sm:p-5" style={{ backgroundColor: "#16132a" }}>
        {/* ชื่อ */}
        <h3 className="text-[#dcb771] font-bold text-base sm:text-lg mb-2 truncate">
          {hotelName}
        </h3>

        {/* ดาว */}
        <div className="mb-2">
          <StarRating rating={displayRating} />
        </div>

        {/* Description */}
        <p className="text-white/35 text-xs sm:text-sm leading-relaxed">
          {displayDescription}
        </p>
      </div>
    </div>
  );
}
