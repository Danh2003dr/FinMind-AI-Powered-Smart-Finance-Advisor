import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

/** Giới hạn upload ảnh hoá đơn / OCR — dùng với FileInterceptor hoặc FilesInterceptor */
export const receiptUploadOptions: MulterOptions = {
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp)$/.test(file.mimetype);
    cb(null, ok);
  },
};
