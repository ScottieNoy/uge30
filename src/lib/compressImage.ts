// utils/compressImage.ts
export async function compressImage(file: File, maxSize = 800): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      image.src = e.target?.result as string;
    };

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
      canvas.width = image.width * scale;
      canvas.height = image.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Failed to get canvas context");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Compression failed");
          resolve(new File([blob], file.name, { type: file.type }));
        },
        file.type,
        0.7 // quality
      );
    };

    image.onerror = reject;
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
