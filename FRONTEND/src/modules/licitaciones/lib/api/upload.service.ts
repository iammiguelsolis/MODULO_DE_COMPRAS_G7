import { supabase } from "./supabase-client";

export const uploadService = {
  uploadDocument: async (
    file: File,
    folder: "propuestas" | "contratos"
  ): Promise<string> => {
    const timestamp = Date.now();
    // Sanitize filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${folder}/${timestamp}_${sanitizedName}`;

    const { data, error } = await supabase.storage
      .from("licitaciones")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) throw new Error(`Error al subir archivo: ${error.message}`);

    const { data: urlData } = await supabase.storage
      .from("licitaciones")
      .createSignedUrl(data.path, 31536000); // 1 año

    if (!urlData?.signedUrl)
      throw new Error("No se pudo generar la URL del archivo");

    return urlData.signedUrl;
  },
};
