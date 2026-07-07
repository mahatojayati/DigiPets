import { useState, useEffect } from "react";
import { petService } from "../services/petService";

interface PetMetadata {
  name: string;
  width: number;
  height: number;
  transparent: boolean;
  size: number;
  mimeType?: string;
}

const CUTE_NAMES = [
  "Mochi",
  "Pebble",
  "Pixel",
  "Boba",
  "Milo",
  "Nova",
  "Beans",
  "Nugget",
  "Luna",
  "Pudding",
  "Koko",
  "Sprout",
  "Chippy",
  "Waffles",
];

export const usePreview = (id: string | null, url: string | null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PetMetadata | null>(null);
  const [petName, setPetName] = useState("");

  const getRandomName = () => {
    const idx = Math.floor(Math.random() * CUTE_NAMES.length);
    return CUTE_NAMES[idx];
  };

  const refreshName = () => {
    setPetName(getRandomName());
  };

  useEffect(() => {
    if (!id || !url) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadMetadata = async () => {
      try {
        // 1. Fetch metadata from backend
        const serverMeta = await petService.getPetMetadata(id);

        if (!isMounted) return;

        // 2. Perform client-side verification of image loading
        const img = new Image();
        img.src = url;
        img.onload = () => {
          if (!isMounted) return;

          // Client-side transparency scanning
          let clientTransparent = serverMeta.transparent;
          try {
            const canvas = document.createElement("canvas");
            canvas.width = Math.min(img.naturalWidth, 100);
            canvas.height = Math.min(img.naturalHeight, 100);
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
              for (let i = 3; i < imgData.length; i += 4) {
                if (imgData[i] < 255) {
                  clientTransparent = true;
                  break;
                }
              }
            }
          } catch {
            // Ignore CORS or canvas errors, rely on server metadata
          }

          setMetadata({
            name: serverMeta.name || "My Pet",
            width: img.naturalWidth || serverMeta.width,
            height: img.naturalHeight || serverMeta.height,
            transparent: clientTransparent,
            size: serverMeta.size,
            mimeType: serverMeta.mimeType,
          });

          setPetName(serverMeta.name || getRandomName());
          setLoading(false);
        };

        img.onerror = () => {
          if (!isMounted) return;
          setError("Failed to load companion image asset. The file may be corrupted.");
          setLoading(false);
        };
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message || "Failed to load companion details.");
        setLoading(false);
      }
    };

    loadMetadata();

    return () => {
      isMounted = false;
    };
  }, [id, url]);

  return {
    loading,
    error,
    metadata,
    petName,
    setPetName,
    refreshName,
  };
};
