/**
 * Service to handle uploading pet images to the backend with seamless client fallback.
 */
export const uploadService = {
  uploadImage: (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ id: string; url: string }> => {
    return new Promise((resolve) => {
      // Helper to generate a client-side Data URL for instant rendering & offline resilience
      const fallbackToClientDataUrl = () => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const id = `upload-${Date.now()}`;
          resolve({ id, url: dataUrl });
        };
        reader.onerror = () => {
          const id = `upload-${Date.now()}`;
          resolve({ id, url: URL.createObjectURL(file) });
        };
        reader.readAsDataURL(file);
      };

      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      // Listen to upload progress
      if (xhr.upload && onProgress) {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        });
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            // If the server provided a base64 dataUrl, use it to ensure persistence across serverless restarts
            const finalUrl = response.dataUrl || response.url;
            resolve({ id: response.id || `upload-${Date.now()}`, url: finalUrl });
          } catch {
            fallbackToClientDataUrl();
          }
        } else {
          // If server upload fails (e.g. serverless limits, 500 error), smoothly fallback to client-side data URL
          console.warn(`Server upload returned status ${xhr.status}. Seamlessly falling back to client-side data URL.`);
          fallbackToClientDataUrl();
        }
      };

      xhr.onerror = () => {
        console.warn("Network error during file upload. Seamlessly falling back to client-side data URL.");
        fallbackToClientDataUrl();
      };

      xhr.open("POST", "/api/upload", true);
      xhr.send(formData);
    });
  },
};
