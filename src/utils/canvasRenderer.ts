import { OutfitLayer, Model, BackgroundScene, AIFitAssessment } from '../types';

/**
 * Loads an image from a URL or DataURI safely with CORS
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      fallbackImg.src = src;
    };
    img.src = src;
  });
}

export interface RenderOptions {
  model: Model;
  customModelImage: string | null;
  layers: OutfitLayer[];
  scene: BackgroundScene;
  width?: number;
  height?: number;
  includeWatermark?: boolean;
  fitAssessment?: AIFitAssessment | null;
  aiBadgeText?: string;
}

/**
 * Renders high-fidelity composite with anatomical cloth fitting, realistic shadows and light blending
 */
export async function renderCompositeCanvas(options: RenderOptions): Promise<string> {
  const {
    model,
    customModelImage,
    layers,
    scene,
    width = 1200,
    height = 1600,
    includeWatermark = true,
    fitAssessment = null,
    aiBadgeText = 'IA FITTING ENGINE • PROBADOR VIRTUAL',
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 1. Render Background Scene
  try {
    const bgUrl = scene.isOriginal && customModelImage ? customModelImage : scene.imageUrl;
    if (bgUrl) {
      const bgImg = await loadImage(bgUrl);
      const scale = Math.max(width / bgImg.width, height / bgImg.height);
      const x = (width - bgImg.width * scale) / 2;
      const y = (height - bgImg.height * scale) / 2;
      ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);

      if (scene.isOriginal) {
        // Soft focus overlay for original background scene
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(0, 0, width, height);
      } else {
        // Subtle dark gradient vignette for depth
        const vignette = ctx.createRadialGradient(
          width / 2, height / 2, width * 0.25,
          width / 2, height / 2, width * 0.85
        );
        vignette.addColorStop(0, 'rgba(0,0,0,0.05)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);
      }

      // Ambient scene tint
      if (scene.ambientTint) {
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = scene.ambientTint;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }
    } else {
      throw new Error('No background URL');
    }
  } catch {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Render Model Base
  const modelSrc = customModelImage || model.imageUrl;
  let modelBounds = { x: 0, y: 0, w: 0, h: 0 };

  try {
    const modelImg = await loadImage(modelSrc);
    const modelTargetWidth = width * 0.72;
    const modelScale = modelTargetWidth / modelImg.width;
    const modelTargetHeight = modelImg.height * modelScale;
    const modelX = (width - modelTargetWidth) / 2;
    const modelY = height - modelTargetHeight + (height * 0.04);

    modelBounds = {
      x: modelX,
      y: modelY,
      w: modelTargetWidth,
      h: modelTargetHeight,
    };

    // Ground contact shadow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(width / 2, height - 70, width * 0.26, 22, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.filter = 'blur(18px)';
    ctx.fill();
    ctx.restore();

    // Secondary tighter contact shadow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(width / 2, height - 60, width * 0.18, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.filter = 'blur(8px)';
    ctx.fill();
    ctx.restore();

    // Draw model with soft rim lighting
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;
    ctx.drawImage(modelImg, modelX, modelY, modelTargetWidth, modelTargetHeight);
    ctx.restore();

    // 3. Render Garment Layers with Anatomical Blending and Natural Drape
    const sortedLayers = [...layers]
      .filter((l) => l.visible)
      .sort((a, b) => a.order - b.order);

    for (const layer of sortedLayers) {
      try {
        const garmentImg = await loadImage(layer.garment.imageUrl);
        ctx.save();
        ctx.globalAlpha = layer.opacity ?? 1;

        const category = layer.garment.category;
        const userScale = layer.scale ?? 1;
        const offsetX = layer.position?.x ?? 0;
        const offsetY = layer.position?.y ?? 0;

        let targetW = width * 0.46 * userScale;
        let targetH = (garmentImg.height / garmentImg.width) * targetW;
        let posX = (width - targetW) / 2 + offsetX;
        let posY = modelY + modelTargetHeight * 0.25 + offsetY;

        if (category === 'superior') {
          // Tops / Shirts / Jackets: fitted to shoulders & torso
          targetW = width * 0.50 * userScale;
          targetH = (garmentImg.height / garmentImg.width) * targetW;
          posX = (width - targetW) / 2 + offsetX;
          posY = modelY + modelTargetHeight * 0.19 + offsetY;

          // Realistic ambient occlusion shadow under collar and armpits
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(width / 2 + offsetX, posY + targetH * 0.95, targetW * 0.42, 14, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
          ctx.filter = 'blur(10px)';
          ctx.fill();
          ctx.restore();

          // Soft contact shadow around torso
        // Draw garment layer with subtle rounded clipping or vignette to prevent harsh square boxes
        ctx.save();
        ctx.beginPath();
        const cornerR = Math.min(targetW, targetH) * 0.08;
        if (ctx.roundRect) {
          ctx.roundRect(posX, posY, targetW, targetH, cornerR);
        } else {
          ctx.rect(posX, posY, targetW, targetH);
        }
        ctx.clip();
        ctx.drawImage(garmentImg, posX, posY, targetW, targetH);
        ctx.restore();

        } else if (category === 'inferior') {
          // Bottoms / Pants / Skirts: fitted to waist & legs
          targetW = width * 0.44 * userScale;
          targetH = (garmentImg.height / garmentImg.width) * targetW;
          posX = (width - targetW) / 2 + offsetX;
          posY = modelY + modelTargetHeight * 0.46 + offsetY;

          // Waistline contact shadow
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(width / 2 + offsetX, posY + 8, targetW * 0.4, 10, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.filter = 'blur(8px)';
          ctx.fill();
          ctx.restore();

          // Draw garment layer with subtle rounded clipping
          ctx.save();
          ctx.beginPath();
          const cornerR2 = Math.min(targetW, targetH) * 0.08;
          if (ctx.roundRect) {
            ctx.roundRect(posX, posY, targetW, targetH, cornerR2);
          } else {
            ctx.rect(posX, posY, targetW, targetH);
          }
          ctx.clip();
          ctx.drawImage(garmentImg, posX, posY, targetW, targetH);
          ctx.restore();

        } else if (category === 'calzado') {
          // Footwear: fitted to feet & ground level
          targetW = width * 0.36 * userScale;
          targetH = (garmentImg.height / garmentImg.width) * targetW;
          posX = (width - targetW) / 2 + offsetX;
          posY = modelY + modelTargetHeight * 0.84 + offsetY;

          // Feet ground shadow
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(width / 2 + offsetX, posY + targetH * 0.92, targetW * 0.45, 12, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.filter = 'blur(12px)';
          ctx.fill();
          ctx.restore();

          // Draw footwear with subtle rounded clipping
          ctx.save();
          ctx.beginPath();
          const cornerR3 = Math.min(targetW, targetH) * 0.08;
          if (ctx.roundRect) {
            ctx.roundRect(posX, posY, targetW, targetH, cornerR3);
          } else {
            ctx.rect(posX, posY, targetW, targetH);
          }
          ctx.clip();
          ctx.drawImage(garmentImg, posX, posY, targetW, targetH);
          ctx.restore();

        } else if (category === 'accesorios') {
          targetW = width * 0.28 * userScale;
          targetH = (garmentImg.height / garmentImg.width) * targetW;
          posX = (width - targetW) / 2 + offsetX;
          posY = modelY + modelTargetHeight * 0.10 + offsetY;

          // Draw accessory with subtle rounded clipping
          ctx.save();
          ctx.beginPath();
          const cornerR4 = Math.min(targetW, targetH) * 0.08;
          if (ctx.roundRect) {
            ctx.roundRect(posX, posY, targetW, targetH, cornerR4);
          } else {
            ctx.rect(posX, posY, targetW, targetH);
          }
          ctx.clip();
          ctx.drawImage(garmentImg, posX, posY, targetW, targetH);
          ctx.restore();
        }

        ctx.restore();
      } catch (err) {
        console.warn(`Could not render layer ${layer.garment.name}:`, err);
      }
    }
  } catch (err) {
    console.error('Error drawing model in canvas:', err);
  }

  // 4. Subtle Studio Lighting & Global Ambient Harmonization
  const lightOverlay = ctx.createLinearGradient(0, 0, width, height);
  lightOverlay.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
  lightOverlay.addColorStop(0.4, 'rgba(255, 255, 255, 0)');
  lightOverlay.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
  ctx.fillStyle = lightOverlay;
  ctx.fillRect(0, 0, width, height);

  // 5. Atelier Watermark / AI Fit Certification Card
  if (includeWatermark) {
    const cardH = 92;
    const cardY = height - cardH - 32;
    const cardW = width - 64;
    const cardX = 32;

    ctx.save();
    // Glassmorphism card base
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 20);
    ctx.fill();

    // Border line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Gold / Emerald AI Badge Icon Pill
    const badgeW = 140;
    const badgeH = 26;
    const badgeX = cardX + 24;
    const badgeY = cardY + 18;
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 13);
    ctx.fill();
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('✦ AJUSTE IA ACTIVO', badgeX + 16, badgeY + 17);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.fillText('ATELIER VIRTUAL TRY-ON', badgeX + badgeW + 16, cardY + 36);

    // Subtitle / Outfit Details
    ctx.fillStyle = '#94A3B8';
    ctx.font = '13px system-ui, -apple-system, sans-serif';
    const equippedCount = layers.filter(l => l.visible).length;
    const modelText = customModelImage ? 'Modelo: Foto Personalizada' : `Modelo: ${model.name}`;
    const fitScoreText = fitAssessment ? ` | Score de Ajuste: ${fitAssessment.fitScore}%` : '';
    const descText = `${modelText} • ${equippedCount} Prendas integradas • Fondo: ${scene.name}${fitScoreText}`;
    ctx.fillText(descText, cardX + 24, cardY + 70);

    // Right Side: Date & Stamp
    const dateStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(dateStr, cardX + cardW - 24, cardY + 52);

    ctx.restore();
  }

  return canvas.toDataURL('image/png', 0.95);
}
