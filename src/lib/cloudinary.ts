import { v2 as cloudinary } from "cloudinary";

let configured = false;

function configure() {
  if (configured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary credentials are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  configured = true;
}

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

export async function uploadImage(
  file: Buffer,
  folder: string,
  publicId: string,
): Promise<UploadResult> {
  configure();

  const result = await new Promise<UploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: false,
        resource_type: "image",
        transformation: [
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Upload returned no result"));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      },
    );

    stream.end(file);
  });

  return result;
}

export async function deleteImage(publicId: string): Promise<void> {
  configure();
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

export function getOptimizedUrl(
  publicId: string,
  options?: { width?: number; height?: number },
): string {
  configure();

  const transformation: Record<string, unknown>[] = [
    { quality: "auto", fetch_format: "auto" },
  ];

  if (options?.width || options?.height) {
    const resize: Record<string, string | number> = {};
    if (options.width) resize.width = options.width;
    if (options.height) resize.height = options.height;
    resize.crop = "limit";
    transformation.unshift(resize);
  }

  return cloudinary.url(publicId, {
    transformation,
    secure: true,
  });
}

export function getPublicIdFromUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}
