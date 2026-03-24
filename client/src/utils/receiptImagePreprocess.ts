/**
 * Chuẩn bị ảnh hoá đơn trước Tesseract: EXIF, thu nhỏ, grayscale, kéo tương phản.
 */
export async function preprocessReceiptForOcr(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  try {
    const maxSide = 2000;
    let w = bitmap.width;
    let h = bitmap.height;
    const scale = Math.min(1, maxSide / Math.max(w, h));
    w = Math.round(w * scale);
    h = Math.round(h * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('canvas');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);

    const id = ctx.getImageData(0, 0, w, h);
    const d = id.data;
    const nPix = (d.length / 4) | 0;
    const gs = new Float32Array(nPix);
    for (let i = 0, j = 0; i < d.length; i += 4, j++) {
      gs[j] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    }

    let min = 255;
    let max = 0;
    for (const v of gs) {
      min = Math.min(min, v);
      max = Math.max(max, v);
    }
    const range = Math.max(35, max - min);

    for (let j = 0; j < nPix; j++) {
      let v = ((gs[j] - min) / range) * 255;
      v = v < 115 ? v * 0.88 : 40 + v * 0.92;
      const b = Math.min(255, Math.max(0, Math.round(v)));
      const k = j * 4;
      d[k] = d[k + 1] = d[k + 2] = b;
      d[k + 3] = 255;
    }

    ctx.putImageData(id, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/png', 1);
    });
    return blob;
  } finally {
    bitmap.close();
  }
}

/**
 * Xoay ảnh PNG (độ CW). Dùng thử 0/90/180/270° khi hoá đơn POS chụp lệch so với hướng chữ in.
 */
export async function rotateReceiptPngBlob(blob: Blob, degreesClockwise: number): Promise<Blob> {
  const d = ((degreesClockwise % 360) + 360) % 360;
  if (d === 0) return blob;

  const bmp = await createImageBitmap(blob);
  try {
    const w = bmp.width;
    const h = bmp.height;
    const rad = (d * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const nw = Math.round(w * cos + h * sin);
    const nh = Math.round(w * sin + h * cos);

    const canvas = document.createElement('canvas');
    canvas.width = nw;
    canvas.height = nh;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, nw, nh);
    ctx.translate(nw / 2, nh / 2);
    ctx.rotate(rad);
    ctx.drawImage(bmp, -w / 2, -h / 2);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/png', 1);
    });
  } finally {
    bmp.close();
  }
}
