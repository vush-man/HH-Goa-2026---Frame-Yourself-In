import heic2any from 'heic2any';

/**
 * Converts HEIC/HEIF image file to JPEG Blob/DataURL
 */
export async function convertHeicIfNeeded(file: File): Promise<{ file: File; dataUrl: string }> {
  const isHeic = file.name.toLowerCase().endsWith('.heic') || 
                 file.name.toLowerCase().endsWith('.heif') || 
                 file.type === 'image/heic' || 
                 file.type === 'image/heif';

  if (isHeic) {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });

      const singleBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      const convertedFile = new File([singleBlob], file.name.replace(/\.heic$/i, '.jpg'), {
        type: 'image/jpeg',
      });

      const dataUrl = await blobToDataURL(convertedFile);
      return { file: convertedFile, dataUrl };
    } catch (err) {
      console.error('HEIC conversion failed, trying direct fallback:', err);
      // Fallback to standard reader
      const dataUrl = await blobToDataURL(file);
      return { file, dataUrl };
    }
  }

  // Standard JPG/PNG/WEBP
  const dataUrl = await blobToDataURL(file);
  return { file, dataUrl };
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(blob);
  });
}

export function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = dataUrl;
  });
}
