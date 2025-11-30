import ImageKit from 'imagekit';
import dotenv from 'dotenv';
import sharp from 'sharp';
dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

interface UploadToImageKitOptions {
  fileBuffer: Buffer;
  fileName?: string;
  folder?: string;
   resizeOptions?: {
    width?: number;
    height?: number;
    quality?: number; 
  };
}

export const uploadToImageKit = async ({
  fileBuffer,
  fileName = `upload-${Date.now()}`,
  folder = '/',
  resizeOptions,
}: UploadToImageKitOptions): Promise<string> => {
  try {
    let processedBuffer = fileBuffer;
    if (resizeOptions) {
      const { width, height, quality = 80 } = resizeOptions;

      processedBuffer = await sharp(fileBuffer)
        .resize(width, height)
        .jpeg({ quality }) 
        .toBuffer();
    }
    const response = await imagekit.upload({
      file: processedBuffer,
      fileName,
      folder,
      useUniqueFileName: true,
      responseFields: ['url'],
    });

    return response.url;
  } catch (error) {
    console.error('Upload to ImageKit failed:', error);
    throw error;
  }
};
