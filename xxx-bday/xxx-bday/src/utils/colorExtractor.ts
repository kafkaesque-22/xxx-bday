// Utility to extract dynamic, legible pastel background colors from image URLs using HTML Canvas

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number; // 0 to 1
  s: number; // 0 to 1
  l: number; // 0 to 1
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, c)).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

/**
 * Extracts a dominant/average color from an image URL and processes it into
 * a highly legible, premium pastel background color (forcing optimal saturation & lightness).
 */
export function extractPastelColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 12;
        canvas.height = 12;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve("");
          return;
        }

        ctx.drawImage(img, 0, 0, 12, 12);
        const imgData = ctx.getImageData(0, 0, 12, 12).data;

        let rSum = 0;
        let gSum = 0;
        let bSum = 0;
        let count = 0;

        for (let i = 0; i < imgData.length; i += 4) {
          // Ignore highly transparent pixels if any
          if (imgData[i + 3] < 150) continue;
          rSum += imgData[i];
          gSum += imgData[i + 1];
          bSum += imgData[i + 2];
          count++;
        }

        if (count === 0) {
          resolve("");
          return;
        }

        const avgR = rSum / count;
        const avgG = gSum / count;
        const avgB = bSum / count;

        // Convert average color to HSL
        const hsl = rgbToHsl(avgR, avgG, avgB);

        // Adjust saturation and lightness for perfect vibrant softness & 100% text legibility
        // Generates beautiful, highly saturated lavender, sage, soft peach, dusty rose depending on the image's source hues
        const targetS = 0.60; // 60% saturation (vibrant, rich, and highly punchy)
        const targetL = 0.74; // 74% lightness (rich and saturated but bright enough that text contrast remains perfect)

        const finalRgb = hslToRgb(hsl.h, targetS, targetL);
        const hexColor = rgbToHex(finalRgb.r, finalRgb.g, finalRgb.b);

        resolve(hexColor);
      } catch (e) {
        resolve("");
      }
    };

    img.onerror = () => {
      resolve("");
    };
  });
}
