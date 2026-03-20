// ===========================================
// src/app/actions.ts
// Server Actions สำหรับ Mutations ทั้งหมด
// - ทุกฟังก์ชันมี "use server" เพื่อรันบน server เท่านั้น
// - ดึง session token จาก NextAuth อัตโนมัติ (client ไม่ต้องส่ง token เอง)
// - เรียก lib functions ที่ใช้ process.env.BACKEND_URL (server-only)
// - ใช้ revalidatePath เพื่อ refresh หน้าหลัง mutation สำเร็จ
//
// ทำไมต้องมีไฟล์นี้:
//   เว็บ Venue เดิมเก็บ booking ใน Redux (client-side) ไม่ต้องเรียก API
//   แต่ Hotel Booking ต้อง CRUD ผ่าน Backend API จริง
//   และ BACKEND_URL เป็น server-only env var → client เรียกตรงไม่ได้
//   จึงต้องใช้ Server Actions เป็นตัวกลาง
// ===========================================

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { revalidatePath, revalidateTag } from "next/cache";

import createBooking from "@/libs/createBooking";
import updateBooking from "@/libs/updateBooking";
import deleteBooking from "@/libs/deleteBooking";
import createHotel from "@/libs/createHotel";
import updateHotel from "@/libs/updateHotel";
import deleteHotel from "@/libs/deleteHotel";
import deleteAccount from "@/libs/deleteAccount";
import userRegister from "@/libs/userRegister";

// ==================
// Auth Actions
// ==================

// สมัครสมาชิก (Public — ไม่ต้อง login)
export async function registerAction(
  name: string,
  tel: string,
  email: string,
  password: string
) {
  try {
    const result = await userRegister(name, tel, email, password);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ลบ account ตัวเอง (Extra Credit)
export async function deleteAccountAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const result = await deleteAccount(session.user.token);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ==================
// Booking Actions
// ==================

// สร้าง Booking ใหม่ (Step 4)
export async function createBookingAction(
  hotelId: string,
  bookingDate: string,
  numOfNights: number
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const result = await createBooking(
      session.user.token,
      hotelId,
      bookingDate,
      numOfNights
    );

    // Refresh หน้า mybooking เพื่อแสดงข้อมูลใหม่
    revalidatePath("/mybooking");
    revalidatePath("/admin/bookings");

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// แก้ไข Booking (Step 6 สำหรับ user, Step 11 สำหรับ admin)
export async function updateBookingAction(
  bookingId: string,
  bookingDate: string,
  numOfNights: number,
  hotelId?: string  // optional: admin ใช้เพื่อเปลี่ยนโรงแรม
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const result = await updateBooking(
      session.user.token,
      bookingId,
      bookingDate,
      numOfNights,
      hotelId
    );

    revalidatePath("/mybooking");
    revalidatePath("/admin/bookings");

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ลบ Booking (Step 7 สำหรับ user, Step 12 สำหรับ admin)
export async function deleteBookingAction(bookingId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const result = await deleteBooking(session.user.token, bookingId);

    revalidatePath("/mybooking");
    revalidatePath("/admin/bookings");

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ==================
// Hotel Actions (Admin Only)
// ==================

// สร้างโรงแรมใหม่ (picture จัดการใน Redux ไม่ส่ง Backend)
export async function createHotelAction(
  name: string,
  address: string,
  tel: string,
  picture?: string,
  rating?: number,
  description?: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }
  if (session.user.role !== "admin") {
    return { success: false, message: "Admin only" };
  }

  try {
    const result = await createHotel(session.user.token, name, address, tel, picture, rating, description);

    revalidateTag("hotels");
    revalidatePath("/hotel");
    revalidatePath("/admin/hotels");

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// แก้ไขโรงแรม (picture จัดการใน Redux ไม่ส่ง Backend)
export async function updateHotelAction(
  hotelId: string,
  name: string,
  address: string,
  tel: string,
  picture?: string,
  rating?: number,
  description?: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }
  if (session.user.role !== "admin") {
    return { success: false, message: "Admin only" };
  }

  try {
    const result = await updateHotel(
      session.user.token,
      hotelId,
      name,
      address,
      tel,
      picture,
      rating,
      description
    );

    revalidateTag("hotels");
    revalidatePath("/hotel");
    revalidatePath("/admin/hotels");

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ลบโรงแรม (จะ cascade delete bookings ที่เกี่ยวข้องด้วย)
export async function deleteHotelAction(hotelId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }
  if (session.user.role !== "admin") {
    return { success: false, message: "Admin only" };
  }

  try {
    const result = await deleteHotel(session.user.token, hotelId);

    revalidateTag("hotels");
    revalidatePath("/hotel");
    revalidatePath("/admin/hotels");
    revalidatePath("/mybooking");
    revalidatePath("/admin/bookings");

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ==================
// Read Actions (สำหรับ client components ที่ต้อง fetch data)
// ==================

// ดึง hotels ทั้งหมด (ใช้ใน admin/hotels page ที่เป็น client component)
export async function getHotelsAction() {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/hotels`,
      { cache: "no-store" }
    );
    if (!response.ok) throw new Error("Failed to fetch hotels");
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message, data: [] };
  }
}
