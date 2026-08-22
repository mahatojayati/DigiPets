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
        // 1. Fetch metadata from backend (falls back gracefully)
        const serverMeta = await petService.getPetMetadata(id);

        if (!isMounted) return;

        // 2. Perform client-side verification of image loading
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;

        const applyMetadata = (loadedImg?: HTMLImageElement) => {
          if (!isMounted) return;

          let clientTransparent = serverMeta.transparent;
          if (loadedImg) {
            try {
              const canvas = document.createElement("canvas");
              canvas.width = Math.min(loadedImg.naturalWidth || 100, 100);
              canvas.height = Math.min(loadedImg.naturalHeight || 100, 100);
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(loadedImg, 0, 0, canvas.width, canvas.height);
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                for (let i = 3; i < imgData.length; i += 4) {
                  if (imgData[i] < 255) {
                    clientTransparent = true;
                    break;
                  }
                }
              }
            } catch {
              // Ignore CORS or canvas errors, use defaults
            }
          }

          setMetadata({
            name: serverMeta.name || getRandomName(),
            width: (loadedImg && loadedImg.naturalWidth) || serverMeta.width || 512,
            height: (loadedImg && loadedImg.naturalHeight) || serverMeta.height || 512,
            transparent: clientTransparent,
            size: serverMeta.size || 50000,
            mimeType: serverMeta.mimeType || "image/png",
          });

          setPetName(serverMeta.name || getRandomName());
          setError(null);
          setLoading(false);
        };

        img.onload = () => applyMetadata(img);
        img.onerror = () => {
          // If image fails to load via regular img, still show preview using the direct URL
          console.warn("Image load warning in preview, applying graceful defaults");
          applyMetadata();
        };

        // Safety timeout to ensure preview never hangs
        setTimeout(() => {
          if (isMounted && loading) {
            applyMetadata(img);
          }
        }, 1500);
      } catch (err: any) {
        if (!isMounted) return;
        setMetadata({
          name: getRandomName(),
          width: 512,
          height: 512,
          transparent: true,
          size: 50000,
          mimeType: "image/png",
        });
        setPetName(getRandomName());
        setError(null);
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
