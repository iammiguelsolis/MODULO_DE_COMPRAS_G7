import { useState } from "react";
import { uploadService } from "../api/upload.service";

export const useSupabaseUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, folder: "propuestas" | "contratos") => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Simular progreso visual ya que supabase client no da progreso granular fácilmente
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const url = await uploadService.uploadDocument(file, folder);

      clearInterval(interval);
      setProgress(100);

      return url;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, progress, error };
};
