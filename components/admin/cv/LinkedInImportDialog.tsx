"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useAdminStore } from "@/stores/useAdminStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateLinkedInJSON, validateLinkedInCSV } from "@/lib/utils/linkedin-parser";
import JSZip from "jszip";

interface LinkedInImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function LinkedInImportDialog({
  open,
  onOpenChange,
  onSuccess,
}: LinkedInImportDialogProps) {
  const [jsonData, setJsonData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const language = useLanguageStore((state) => state.language);
  const token = useAdminStore((state) => state.token);

  const content = {
    tr: {
      title: "LinkedIn Verilerini İçe Aktar",
      description: "LinkedIn'den indirdiğiniz JSON, CSV veya ZIP dosyasını yükleyin",
      uploadFile: "JSON/CSV/ZIP Dosyası Yükle",
      or: "veya",
      pasteJson: "JSON'u yapıştırın",
      import: "İçe Aktar",
      cancel: "İptal",
      success: "LinkedIn verileri başarıyla içe aktarıldı",
      error: "İçe aktarma başarısız oldu",
      invalidFile: "Geçersiz LinkedIn export dosyası",
      required: "Lütfen bir dosya yükleyin veya JSON'u yapıştırın",
      instructions: "LinkedIn'den verilerinizi indirmek için: Ayarlar > Veri gizliliği > Verilerinizi indirin",
      placeholder: "LinkedIn JSON verilerinizi buraya yapıştırın...",
    },
    en: {
      title: "Import LinkedIn Data",
      description: "Upload the JSON, CSV or ZIP file you downloaded from LinkedIn",
      uploadFile: "Upload JSON/CSV/ZIP File",
      or: "or",
      pasteJson: "Paste JSON",
      import: "Import",
      cancel: "Cancel",
      success: "LinkedIn data imported successfully",
      error: "Import failed",
      invalidFile: "Invalid LinkedIn export file",
      required: "Please upload a file or paste JSON",
      instructions:
        "To download your data from LinkedIn: Settings > Data privacy > Download your data",
      placeholder: "Paste your LinkedIn JSON data here...",
    },
  };

  const t = content[language];

  const handleJsonFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      // Check if it's a ZIP file
      if (file.name.endsWith('.zip')) {
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        // Extract CSV files
        const positionsContent = await zip.file('Positions.csv')?.async('text');
        const educationContent = await zip.file('Education.csv')?.async('text');
        const skillsContent = await zip.file('Skills.csv')?.async('text');

        if (!positionsContent && !educationContent && !skillsContent) {
          setError("ZIP dosyasında LinkedIn CSV dosyaları bulunamadı");
          setLoading(false);
          return;
        }

        // Store as JSON-like structure
        const csvData = {
          Positions: positionsContent || '',
          Education: educationContent || '',
          Skills: skillsContent || '',
        };

        setJsonData(JSON.stringify(csvData));
        setLoading(false);
      } else if (file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const text = reader.result as string;

          // Determine which CSV file it is based on header
          let csvType = 'Unknown';
          if (text.toLowerCase().includes('company name')) {
            csvType = 'Positions';
          } else if (text.toLowerCase().includes('school name')) {
            csvType = 'Education';
          } else if (text.toLowerCase().includes('name')) {
            csvType = 'Skills';
          }

          const csvData: Record<string, string> = {};
          csvData[csvType] = text;

          setJsonData(JSON.stringify(csvData));
          setError("");
          setLoading(false);
        };
        reader.readAsText(file);
      } else {
        // JSON file
        const reader = new FileReader();
        reader.onloadend = () => {
          const text = reader.result as string;
          setJsonData(text);
          setError("");
          setLoading(false);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error("Error processing file:", err);
      setError("Dosya işlenirken bir hata oluştu");
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!jsonData.trim()) {
      setError(t.required);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Parse JSON to validate
      const parsedData = JSON.parse(jsonData);

      // Check if it's CSV format (has Positions, Education, Skills as strings)
      // CSV format has these fields as raw CSV strings, JSON format has nested objects
      const isCSVFormat =
        (parsedData.Positions && typeof parsedData.Positions === 'string') ||
        (parsedData.Education && typeof parsedData.Education === 'string') ||
        (parsedData.Skills && typeof parsedData.Skills === 'string');
      let validation;

      if (isCSVFormat) {
        validation = validateLinkedInCSV(parsedData);
      } else {
        validation = validateLinkedInJSON(parsedData);
      }

      if (!validation.valid) {
        setError(validation.error || t.invalidFile);
        setLoading(false);
        return;
      }

      // Send to API
      if (!token) throw new Error("Unauthorized");
      const response = await fetch("/api/admin/cv/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jsonData: parsedData, isCSV: isCSVFormat }),
      });

      if (!response.ok) {
        throw new Error("Import failed");
      }

      const result = await response.json();

      toast({
        title: t.success,
        description: `Imported: ${result.imported.experiences} experiences, ${result.imported.education} education, ${result.imported.skills} skills`,
      });

      onOpenChange(false);
      setJsonData("");
      setError("");
      onSuccess();
    } catch (err) {
      console.error("Error importing LinkedIn data:", err);
      setError(t.error);
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {t.instructions}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.uploadFile}</label>
            <input
              type="file"
              accept=".json,.csv,.zip,application/json,text/csv,application/zip"
              onChange={handleJsonFileChange}
              className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-1.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground file:cursor-pointer file:leading-none hover:file:bg-primary/90"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 border-t"></div>
            <span className="text-sm text-muted-foreground">{t.or}</span>
            <div className="flex-1 border-t"></div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.pasteJson}</label>
            <Textarea
              value={jsonData}
              onChange={(e) => {
                setJsonData(e.target.value);
                setError("");
              }}
              rows={12}
              placeholder={t.placeholder}
              className="font-mono text-xs"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
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
          <Button type="button" onClick={handleImport} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.import}...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {t.import}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

