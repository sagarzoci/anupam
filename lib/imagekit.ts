import ImageKit from "imagekit";

let _ik: ImageKit | null = null;

export function getImageKit(): ImageKit {
  if (_ik) return _ik;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error("ImageKit credentials missing in .env.local");
  }
  _ik = new ImageKit({ publicKey, privateKey, urlEndpoint });
  return _ik;
}

/**
 * Delete a file from ImageKit by its fileId.
 * Silently ignores errors (file may have been manually deleted already).
 */
export async function deleteFromImageKit(fileId: string): Promise<void> {
  if (!fileId) return;
  try {
    const ik = getImageKit();
    await ik.deleteFile(fileId);
  } catch (err) {
    console.warn(`[ImageKit] Could not delete fileId ${fileId}:`, err);
  }
}
