// ===========================================
// src/components/HotelCatalog.tsx
// Hotel Catalog Grid (Async Server Component)
// - รับ Promise → resolve → แสดง grid ของ HotelCard
// - ส่ง hotelId ให้ HotelCard เพื่อดึง meta (rating/description) จาก Redux
// ===========================================

import Link from "next/link";
import HotelCard from "./HotelCard";

export default async function HotelCatalog({
  hotelsJson,
}: {
  hotelsJson: any;
}) {
  const hotelJsonReady = await hotelsJson;

  if (
    !hotelJsonReady.success ||
    !hotelJsonReady.data ||
    hotelJsonReady.data.length === 0
  ) {
    return (
      <div className="text-white/40 text-lg mt-10">
        No hotels available at the moment.
      </div>
    );
  }

  return (
    <>
      <p className="text-white/30 text-sm mb-6">
        Showing {hotelJsonReady.data.length} hotel{hotelJsonReady.data.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-[1100px] mx-auto px-4">
        {hotelJsonReady.data.map((hotel: any) => (
          <Link
            href={`/hotel/${hotel._id}`}
            key={hotel._id}
            className="flex justify-center"
          >
            <HotelCard
              hotelId={hotel._id}
              hotelName={hotel.name}
              imgSrc={hotel.picture || undefined}
              hotelRating={hotel.rating ?? null}
              hotelDescription={hotel.description ?? null}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
