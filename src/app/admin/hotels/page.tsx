// ===========================================
// src/app/admin/hotels/page.tsx
// Admin: Manage Hotels — state + layout shell
// JSX แยกไปที่ AdminHotelFormPanel + AdminHotelListPanel เพื่อไม่ให้ไฟล์ยาวเกิน
// ===========================================

"use client";
import { useState, useEffect } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { createHotelAction, updateHotelAction, deleteHotelAction, getHotelsAction } from "@/app/actions";
import { useDispatch } from "react-redux";
import { useAppSelector, AppDispatch } from "@/redux/store";
import { setHotelMeta, getHotelMeta } from "@/redux/features/bookSlice";
import AdminHotelFormPanel from "@/components/admin/AdminHotelFormPanel";
import AdminHotelListPanel from "@/components/admin/AdminHotelListPanel";

type Hotel = { _id: string; name: string; address: string; tel: string; picture?: string; rating?: number; description?: string };

export default function AdminHotelsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const hotelMetaStore = useAppSelector((state) => state.bookSlice.hotelMeta);

  // ---- Hotel list state ----
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);

  // ---- Form state ----
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");
  const [picture, setPicture] = useState("");
  const [rating, setRating] = useState<number>(4);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ---- Alert state ----
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---- Delete dialog state ----
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [deletingName, setDeletingName] = useState("");
  const [deleting, setDeleting] = useState(false);

  // ---- Fetch hotels ----
  const fetchHotels = async () => {
    setLoadingHotels(true);
    try {
      const data = await getHotelsAction();
      setHotels(data.data || []);
    } catch { /* ignore */ } finally { setLoadingHotels(false); }
  };

  useEffect(() => { fetchHotels(); }, []);

  // ---- Submit (create / update) ----
  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!name.trim()) { setError("Hotel name is required."); return; }
    if (!address.trim()) { setError("Address is required."); return; }
    if (!tel.trim()) { setError("Telephone is required."); return; }

    setSubmitting(true);
    try {
      const result = formMode === "create"
        ? await createHotelAction(name, address, tel, picture || undefined, rating, description || undefined)
        : await updateHotelAction(editingId, name, address, tel, picture || undefined, rating, description || undefined);

      if (result.success) {
        const hId = formMode === "create" ? result.data?.data?._id : editingId;
        if (hId) {
          dispatch(setHotelMeta({ hotelId: hId, meta: { rating, description: description || "Hotel", picture: picture || undefined } }));
        }
        setSuccess(formMode === "create" ? "Hotel created successfully!" : "Hotel updated successfully!");
        resetForm();
        await fetchHotels();
      } else { setError(result.message || "Something went wrong."); }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally { setSubmitting(false); }
  };

  // ---- Start editing hotel ----
  const startEdit = (h: Hotel) => {
    setFormMode("edit"); setEditingId(h._id);
    setName(h.name); setAddress(h.address); setTel(h.tel); setPicture(h.picture || "");
    const m = getHotelMeta(hotelMetaStore, h._id, h.name);
    setRating(h.rating ?? m.rating); setDescription(h.description ?? m.description);
    setError(""); setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---- Reset form ----
  const resetForm = () => {
    setFormMode("create"); setEditingId(""); setName(""); setAddress(""); setTel("");
    setPicture(""); setRating(4); setDescription("");
  };

  // ---- Confirm delete ----
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteHotelAction(deletingId);
      if (result.success) {
        setDeleteDialogOpen(false);
        setSuccess("Hotel deleted.");
        await fetchHotels();
      } else { setError(result.message || "Failed."); }
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setDeleting(false); }
  };

  return (
    // ⚠️ ใช้ inline style แทน pt-24 เพราะ Tailwind v4 JIT ไม่ generate class ใหม่
    // ธีมตรงกับ booking page: bg #0d0b1a, paddingTop 120px
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d0b1a",
        paddingTop: "80px",
        paddingBottom: "64px",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ===== Page Header ===== */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: "#dcb771", fontSize: "30px", fontWeight: "700", marginBottom: "4px" }}>
            Manage Hotels
          </h1>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
            Add, edit, or remove hotels from the platform.
          </p>
        </div>

        {/* ===== Alerts ===== */}
        {error && (
          <div style={{ marginBottom: "24px" }}>
            <Alert severity="error" sx={{ borderRadius: "10px" }} onClose={() => setError("")}>
              {error}
            </Alert>
          </div>
        )}
        {success && (
          <div style={{ marginBottom: "24px" }}>
            <Alert severity="success" sx={{ borderRadius: "10px" }} onClose={() => setSuccess("")}>
              {success}
            </Alert>
          </div>
        )}

        {/* ===== 2-Column Layout: Form (left) + List (right) ===== */}
        <div style={{ display: "flex", flexDirection: "row", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <AdminHotelFormPanel
            formMode={formMode}
            name={name} setName={setName}
            address={address} setAddress={setAddress}
            tel={tel} setTel={setTel}
            picture={picture} setPicture={setPicture}
            rating={rating} setRating={setRating}
            description={description} setDescription={setDescription}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />

          <AdminHotelListPanel
            hotels={hotels}
            loadingHotels={loadingHotels}
            hotelMetaStore={hotelMetaStore}
            onEdit={startEdit}
            onDeleteRequest={(h) => {
              setDeletingId(h._id);
              setDeletingName(h.name);
              setDeleteDialogOpen(true);
            }}
          />
        </div>
      </div>

      {/* ===== Delete Confirm Dialog ===== */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#12101f",
              color: "white",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.08)",
            },
          },
        }}
      >
        <DialogTitle sx={{ color: "#dcb771" }}>Delete Hotel</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "rgba(255,255,255,0.5)" }}>
            Delete <strong style={{ color: "white" }}>{deletingName}</strong>? All associated bookings will also be removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: "rgba(255,255,255,0.3)", textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="contained"
            sx={{ backgroundColor: "#ef4444", color: "white", borderRadius: "8px", px: 3, textTransform: "none", "&:hover": { backgroundColor: "#dc2626" } }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}