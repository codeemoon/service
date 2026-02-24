/**
 * Converts any image File to WebP format using the browser Canvas API.
 * @param {File} file - The original image file
 * @param {number} quality - WebP quality 0–1 (default 0.88)
 * @returns {Promise<File>} - A new File in image/webp format
 */
export const convertToWebp = (file, quality = 0.88) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      URL.revokeObjectURL(objectUrl);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas toBlob failed"));
            return;
          }
          // Rename with .webp extension
          const webpName = file.name.replace(/\.[^.]+$/, "") + ".webp";
          const webpFile = new File([blob], webpName, { type: "image/webp" });
          resolve(webpFile);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for conversion"));
    };

    img.src = objectUrl;
  });
};
