"use client";

import { useState, useRef, useCallback } from "react";
import type { MediaImage } from "@/types";

interface ImageFieldProps {
  name: string;
  label: string;
  existingImage?: MediaImage;
  onUploadComplete?: (image: MediaImage) => void;
  onRemove?: () => void;
  error?: string;
  folder: "projects" | "certificates";
  entityId: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024;

type UploadState = "idle" | "preview" | "uploading" | "uploaded" | "error";

export function ImageField({
  name,
  label,
  existingImage,
  onUploadComplete,
  onRemove,
  error,
  folder,
  entityId,
}: ImageFieldProps) {
  const [uploadState, setUploadState] = useState<UploadState>(
    existingImage ? "uploaded" : "idle",
  );
  const [preview, setPreview] = useState<string | null>(
    existingImage?.url || null,
  );
  const [altText, setAltText] = useState(existingImage?.alt || "");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<MediaImage | null>(
    existingImage || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadError(null);

      // Client-side validation
      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadError("Must be JPEG, PNG, WebP, or AVIF.");
        setUploadState("error");
        return;
      }

      if (file.size > MAX_SIZE) {
        setUploadError("Must be 5 MB or smaller.");
        setUploadState("error");
        return;
      }

      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileInfo(`${file.name} (${sizeMB} MB)`);

      // Show local preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        setUploadState("preview");
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const handleUpload = useCallback(async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploadState("uploading");
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const endpoint =
        folder === "projects"
          ? `/api/admin/upload/project/${entityId}`
          : `/api/admin/upload/certificate/${entityId}`;

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok || !result.url) {
        throw new Error(result.error || "Upload failed");
      }

      const image: MediaImage = {
        url: result.url,
        publicId: result.publicId,
        alt: altText || `${entityId} image`,
      };

      setCurrentImage(image);
      setPreview(result.url);
      setUploadState("uploaded");
      onUploadComplete?.(image);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      setUploadError(message);
      setUploadState("error");
    }
  }, [altText, entityId, folder, onUploadComplete]);

  const handleRemove = useCallback(async () => {
    if (currentImage?.publicId) {
      try {
        const { removeImage } = await import("@/actions/images");
        await removeImage(currentImage.publicId);
      } catch {
        // Continue with UI removal even if server-side delete fails
      }
    }

    setCurrentImage(null);
    setPreview(null);
    setFileInfo(null);
    setAltText("");
    setUploadState("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  }, [currentImage, onRemove]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Hidden inputs for form submission */}
      {currentImage && (
        <>
          <input type="hidden" name={`${name}Url`} value={currentImage.url} />
          <input type="hidden" name={`${name}PublicId`} value={currentImage.publicId} />
          <input type="hidden" name={`${name}Alt`} value={currentImage.alt} />
        </>
      )}

      {/* File input */}
      {(uploadState === "idle" || uploadState === "error") && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <label
              htmlFor={`${name}-file`}
              className="inline-flex cursor-pointer items-center gap-2 rounded border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.04]"
            >
              Choose image
            </label>
            <input
              ref={fileInputRef}
              id={`${name}-file`}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.avif"
              onChange={handleFileChange}
              className="sr-only"
            />
            {fileInfo && (
              <span className="text-xs text-muted">{fileInfo}</span>
            )}
          </div>
          <p className="text-xs text-muted">
            JPEG, PNG, WebP, or AVIF. Max 5 MB.
          </p>
        </div>
      )}

      {/* Preview + alt text + actions */}
      {preview && (uploadState === "preview" || uploadState === "uploaded" || uploadState === "uploading") && (
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={altText || "Preview"}
              className="h-40 w-full object-cover"
            />
            {uploadState === "uploading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <span className="text-sm text-muted">Uploading...</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${name}-alt`} className="text-xs font-medium">
              Alt text
            </label>
            <input
              id={`${name}-alt`}
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image"
              className="field text-sm"
            />
          </div>

          <div className="flex gap-2">
            {uploadState === "preview" && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={!altText.trim()}
                className="rounded bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent/85 disabled:pointer-events-none disabled:opacity-40"
              >
                Upload
              </button>
            )}
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploadState === "uploading"}
              className="rounded border border-border px-4 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10 disabled:pointer-events-none disabled:opacity-40"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Upload error */}
      {uploadError && (
        <p className="text-xs text-red-500">{uploadError}</p>
      )}

      {/* Server-side validation error */}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
