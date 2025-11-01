"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguageStore } from "@/stores/useLanguageStore";

interface CacheSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDuration: number;
  onSuccess: () => void;
}

export function CacheSettingsDialog({
  open,
  onOpenChange,
  currentDuration,
  onSuccess,
}: CacheSettingsDialogProps) {
  const [duration, setDuration] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    // Convert milliseconds to hours for display
    setDuration((currentDuration / (1000 * 60 * 60)).toString());
  }, [currentDuration, open]);

  const content = {
    tr: {
      title: "Cache Ayarları",
      description: "GitHub proje senkronizasyonu ne sıklıkta yapılacak?",
      durationLabel: "Süre (saat)",
      save: "Kaydet",
      cancel: "İptal",
      success: "Cache ayarları güncellendi",
      error: "Bir hata oluştu",
      invalidDuration: "Geçerli bir süre girin",
    },
    en: {
      title: "Cache Settings",
      description: "How often should GitHub projects sync?",
      durationLabel: "Duration (hours)",
      save: "Save",
      cancel: "Cancel",
      success: "Cache settings updated",
      error: "An error occurred",
      invalidDuration: "Enter a valid duration",
    },
  };

  const t = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hours = parseFloat(duration);
    if (isNaN(hours) || hours <= 0) {
      toast({
        title: t.invalidDuration,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const token = process.env.NEXT_PUBLIC_ADMIN_KEY || "default-admin-key";
      // Convert hours to milliseconds
      const milliseconds = hours * 60 * 60 * 1000;

      const response = await fetch("/api/admin/projects/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cacheDuration: milliseconds }),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      toast({
        title: t.success,
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error updating cache settings:", error);
      toast({
        title: t.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.durationLabel}</label>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              {language === "tr"
                ? "GitHub projeleri bu süre sonunda otomatik senkronize edilir"
                : "GitHub projects will auto-sync after this duration"}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {t.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

