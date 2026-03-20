"use client";
import { useState } from "react";
import { CircularProgress, Rating } from "@mui/material";

// ---- Shared input style ----
export const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "rgba(0,0,0,0.25)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "10px",
  padding: "10px 14px",
  color: "white",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
};

// ---- Reusable field wrapper ----
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.45)", fontSize: "11px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase" }}>
        {label}
        {required && <span style={{ color: "#dcb771" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ---- Props ----
interface AdminHotelFormPanelProps {
  formMode: "create" | "edit";
  name: string; setName: (v: string) => void;
  address: string; setAddress: (v: string) => void;
  tel: string; setTel: (v: string) => void;
  picture: string; setPicture: (v: string) => void;
  rating: number; setRating: (v: number) => void;
  description: string; setDescription: (v: string) => void;
  submitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function AdminHotelFormPanel({
  formMode, name, setName, address, setAddress, tel, setTel,
  picture, setPicture, rating, setRating, description, setDescription,
  submitting, onSubmit, onCancel,
}: AdminHotelFormPanelProps) {
  const [fileName, setFileName] = useState("");

  const focusGold = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "rgba(220,183,113,0.4)");
  const blurGray = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.07)");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setPicture(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearPicture = () => {
    setPicture("");
    setFileName("");
  };

  return (
    <div
      style={{
        width: "400px",
        minWidth: "300px",
        flexShrink: 0,
        position: "sticky",
        top: "88px",
        backgroundColor: "#1a1730",
        border: "1px solid rgba(220,183,113,0.08)",
        borderRadius: "16px",
        padding: "28px 24px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Form title */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
        <span style={{ color: "#dcb771", fontSize: "18px", fontWeight: "700" }}>+</span>
        <h2 style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase" }}>
          {formMode === "create" ? "Add New Hotel" : `Editing: ${name}`}
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Hotel Name */}
        <Field label="Hotel Name" required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Grand Palace Hotel"
            style={inputStyle}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </Field>

        {/* Address */}
        <Field label="Address" required>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 123 Sukhumvit Road, Bangkok"
            style={inputStyle}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </Field>

        {/* Telephone */}
        <Field label="Telephone" required>
          <input
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            placeholder="e.g. 02-111-2222"
            style={inputStyle}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </Field>

        {/* Picture */}
        <Field label="Hotel Picture">
          {/* Preview */}
          {picture && (
            <div style={{ position: "relative", width: "100%", height: "150px", borderRadius: "12px", overflow: "hidden", marginBottom: "2px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={picture}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Dark overlay at bottom for filename */}
              {fileName && (
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                  padding: "20px 10px 8px",
                  fontSize: "11px", color: "rgba(255,255,255,0.7)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {fileName}
                </div>
              )}
              <button
                onClick={handleClearPicture}
                style={{
                  position: "absolute", top: "8px", right: "8px",
                  background: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  width: "26px", height: "26px",
                  cursor: "pointer", color: "rgba(255,255,255,0.8)",
                  fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center",
                }}
                title="Remove image"
              >
                ×
              </button>
            </div>
          )}

          {/* URL Input */}
          <div style={{ position: "relative" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "rgba(255,255,255,0.2)", pointerEvents: "none" }}
            >
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              value={picture.startsWith("data:") ? "" : picture}
              onChange={(e) => { setPicture(e.target.value); setFileName(""); }}
              placeholder="https://example.com/image.jpg"
              style={{ ...inputStyle, paddingLeft: "34px" }}
              onFocus={focusGold}
              onBlur={blurGray}
            />
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "4px 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }} />
            <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "11px", letterSpacing: "1px" }}>OR</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Browse Button */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "10px",
              border: picture.startsWith("data:") ? "1px solid rgba(220,183,113,0.3)" : "1px solid rgba(255,255,255,0.08)",
              backgroundColor: picture.startsWith("data:") ? "rgba(220,183,113,0.06)" : "rgba(255,255,255,0.03)",
              color: picture.startsWith("data:") ? "rgba(220,183,113,0.8)" : "rgba(255,255,255,0.4)",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s",
              width: "100%",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              style={{ width: "15px", height: "15px", flexShrink: 0 }}
            >
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {picture.startsWith("data:") && fileName
              ? fileName.length > 28 ? fileName.slice(0, 25) + "..." : fileName
              : "Upload from device"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </label>
        </Field>

        {/* Rating */}
        <Field label="Display Rating">
          <Rating
            value={rating}
            onChange={(_, v) => setRating(v || 4)}
            sx={{
              "& .MuiRating-iconFilled": { color: "#dcb771" },
              "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.12)" },
            }}
          />
        </Field>

        {/* Description */}
        <Field label="Description / Type">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Boutique hotel in the heart of the city..."
            rows={3}
            style={{ ...inputStyle, resize: "vertical", lineHeight: "1.5", minHeight: "80px" }}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </Field>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px", paddingTop: "4px" }}>
          <button
            onClick={onSubmit}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "14px",
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
              background: "linear-gradient(135deg, #e8c98c 0%, #c5a059 100%)",
              color: "#12101f",
              transition: "opacity 0.2s",
            }}
          >
            {submitting ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <CircularProgress size={16} sx={{ color: "#12101f" }} />
                {formMode === "create" ? "Adding..." : "Saving..."}
              </span>
            ) : (
              formMode === "create" ? "Add Hotel" : "Save Changes"
            )}
          </button>

          {formMode === "edit" && (
            <button
              onClick={onCancel}
              style={{ padding: "12px 20px", borderRadius: "12px", fontSize: "14px", fontWeight: "500", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
