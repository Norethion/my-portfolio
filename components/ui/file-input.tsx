"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";

export interface FileInputProps {
  value?: string;
  onChange: (base64: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileInput({
  value,
  onChange,
  accept = "image/*",
  maxSize = 5,
  className,
}: FileInputProps) {
  const [preview, setPreview] = React.useState<string | null>(value || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const language = useLanguageStore((state) => state.language);

  const content = {
    tr: {
      clickToSelect: "Tıklayarak resim seçin",
      maxSize: "Maksimum",
      fileTooLarge: "Dosya boyutu {maxSize}MB'dan küçük olmalıdır",
    },
    en: {
      clickToSelect: "Click to select image",
      maxSize: "Maximum",
      fileTooLarge: "File size must be less than {maxSize}MB",
    },
  };

  const t = content[language];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(t.fileTooLarge.replace("{maxSize}", maxSize.toString()));
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange(base64String);
      setPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange("");
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input p-6 transition-colors hover:border-primary/50 hover:bg-accent/10"
      >
        {preview ? (
          <div className="relative w-full max-w-xs">
            <Image
              src={preview}
              alt="Preview"
              width={128}
              height={128}
              className="h-32 w-32 rounded-full object-cover mx-auto border-2 border-primary"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute right-0 top-0 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <Upload className="mb-2 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t.clickToSelect}
            </p>
            <p className="text-xs text-muted-foreground">
              {t.maxSize} {maxSize}MB
            </p>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

