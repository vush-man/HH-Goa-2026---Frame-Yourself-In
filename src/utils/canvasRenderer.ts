import { CanvasRenderOptions, FrameFormat } from '../types';

/**
 * Checks if a point (x, y) in canvas coordinates lies within the photo viewport
 */
export function isPointInPhotoRegion(format: FrameFormat, x: number, y: number): boolean {
  if (format === 'pfp') {
    const photoCenterX = 540;
    const photoCenterY = 490;
    const radius = 380;
    const dx = x - photoCenterX;
    const dy = y - photoCenterY;
    return dx * dx + dy * dy <= radius * radius;
  } else {
    const photoX = 310;
    const photoY = 265;
    const photoW = 460;
    const photoH = 490;
    return x >= photoX && x <= photoX + photoW && y >= photoY && y <= photoY + photoH;
  }
}

/**
 * Draws the high-res graphic on the canvas context.
 */
export async function renderGraphicToCanvas(
  ctx: CanvasRenderingContext2D,
  options: CanvasRenderOptions,
  canvasWidth: number,
  canvasHeight: number
) {
  const { format, photo, profile, showCirclePreview } = options;

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (format === 'pfp') {
    await drawPfpFrame(ctx, photo, profile, canvasWidth, canvasHeight, showCirclePreview);
  } else {
    await drawBuilderPass(ctx, photo, profile, canvasWidth, canvasHeight);
  }
}

/**
 * Draw Format A: PFP Frame / Overlay (1080 x 1080)
 */
async function drawPfpFrame(
  ctx: CanvasRenderingContext2D,
  photo: CanvasRenderOptions['photo'],
  profile: CanvasRenderOptions['profile'],
  w: number,
  h: number,
  showCirclePreview?: boolean
) {
  // 1. Background Fill - Deep Goan Forest Green
  ctx.fillStyle = '#005C31';
  ctx.fillRect(0, 0, w, h);

  // Draw tropical background palm tree subtle vectors in corners
  drawPalmLeavesBackground(ctx, w, h);

  // 2. Render User Photo inside central viewport
  const photoCenterX = w / 2;
  const photoCenterY = 490;
  const radius = 380; // 760px diameter frame

  ctx.save();
  ctx.beginPath();
  ctx.arc(photoCenterX, photoCenterY, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Draw photo with transform
  if (photo.imageObj) {
    drawUserPhoto(ctx, photo, photoCenterX, photoCenterY, radius * 2, radius * 2);
  } else {
    // Branded empty placeholder
    ctx.fillStyle = '#004726';
    ctx.fillRect(photoCenterX - radius, photoCenterY - radius, radius * 2, radius * 2);
    
    ctx.fillStyle = '#8DC63F';
    ctx.font = 'bold 32px "JetBrains Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UPLOAD YOUR PHOTO', photoCenterX, photoCenterY);
  }
  ctx.restore();

  // 3. Draw Outer Goan Frame Ring & Border
  drawGoanBorderRing(ctx, photoCenterX, photoCenterY, radius + 10);

  // 4. Draw Outer Corner Ornaments
  drawCornerFoliage(ctx, w, h);

  // 5. Draw Top Header Stamp Badge with high-visibility background pill
  ctx.save();
  const topText = '2:47 PM STUDIO  •  HH GOA 2026';
  ctx.font = 'bold 22px "Fredoka", "JetBrains Mono", sans-serif';
  const textWidth = ctx.measureText(topText).width;
  const pillW = textWidth + 48;
  const pillH = 44;
  const pillX = (w - pillW) / 2;
  const pillY = 30;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = '#FFE600';
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 14);
  ctx.fill();

  ctx.strokeStyle = '#121212';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#121212';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(topText, w / 2, pillY + pillH / 2 + 1);
  ctx.restore();

  // 6. Draw Bottom Banner & Branding
  drawHackerHouseBranding(ctx, w / 2, h - 145, 0.60);

  // 7. Footer Timestamp & Team Stamp
  ctx.save();
  if (profile?.teamName) {
    const teamStamp = `✦ SQUAD: ${profile.teamName.trim().toUpperCase()}`;
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    const tWidth = ctx.measureText(teamStamp).width + 32;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = '#FF007A';
    ctx.beginPath();
    ctx.roundRect((w - tWidth) / 2, h - 80, tWidth, 30, 8);
    ctx.fill();

    ctx.strokeStyle = '#FFE600';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#FFE600';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText(teamStamp, w / 2, h - 65);
  }

  ctx.fillStyle = '#FAF8F5';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('GOA, INDIA  •  28 - 31 OCT 2026', w / 2, profile?.teamName ? h - 20 : h - 34);
  ctx.restore();

  // 8. Optional Twitter Circle Preview Mask (for editor view)
  if (showCirclePreview) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.arc(photoCenterX, photoCenterY, radius, 0, Math.PI * 2, true);
    ctx.fill();

    // Circle Outline
    ctx.strokeStyle = '#FFE600';
    ctx.setLineDash([12, 12]);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(photoCenterX, photoCenterY, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FFE600';
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('X PROFILE CROP PREVIEW', w / 2, photoCenterY - radius - 16);
    ctx.restore();
  }
}

/**
 * Draw Format B: Builder Pass / ID Card (1080 x 1350)
 */
async function drawBuilderPass(
  ctx: CanvasRenderingContext2D,
  photo: CanvasRenderOptions['photo'],
  profile: CanvasRenderOptions['profile'],
  w: number,
  h: number
) {
  // Theme Background Setup
  let bgMain = '#005C31';
  let cardBg = '#FAF8F5';
  let cardText = '#121212';
  let badgeBg = '#FF007A';
  let badgeText = '#FFE600';
  let squadBg = '#FFE600';
  let squadText = '#121212';

  if (profile.theme === 'sunset-yellow') {
    bgMain = '#005C31';
    cardBg = '#FFE600';
    cardText = '#005C31';
    badgeBg = '#FF007A';
    badgeText = '#FFFFFF';
    squadBg = '#003B1F';
    squadText = '#FFE600';
  } else if (profile.theme === 'magenta-pink') {
    bgMain = '#005C31';
    cardBg = '#FF007A';
    cardText = '#FFFFFF';
    badgeBg = '#FFE600';
    badgeText = '#121212';
    squadBg = '#121212';
    squadText = '#FFE600';
  } else if (profile.theme === 'midnight-dark') {
    bgMain = '#121814';
    cardBg = '#1E2621';
    cardText = '#FAF8F5';
    badgeBg = '#8DC63F';
    badgeText = '#121212';
    squadBg = '#FF007A';
    squadText = '#FFFFFF';
  }

  // 1. Background Canvas
  ctx.fillStyle = bgMain;
  ctx.fillRect(0, 0, w, h);

  // Background Palm & Beach Vector Silhouettes
  drawBeachSunsetVectors(ctx, w, h);

  // 2. Top Decorative Goan Tile Strip
  drawTileStrip(ctx, 0, 0, w, 26);

  // 3. Header Text: "2:47 PM STUDIO • OFFICIAL BUILDER PASS"
  ctx.save();
  ctx.fillStyle = '#FFE600';
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('2:47 PM STUDIO', 48, 62);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#8DC63F';
  ctx.fillText('OFFICIAL BUILDER PASS', w - 48, 62);
  ctx.restore();

  // 4. Large Branding Header: "HACKER HOUSE" + "गोवा" Overlay
  drawHackerHouseBranding(ctx, w / 2, 160, 0.85);

  // 5. Center User Photo Badge Box
  const photoW = 460;
  const photoH = 490;
  const photoX = (w - photoW) / 2;
  const photoY = 265;

  // Photo Frame Outer Shadow & Border
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 12;

  // Frame Background Box
  ctx.fillStyle = '#121212';
  ctx.fillRect(photoX, photoY, photoW, photoH);
  ctx.restore();

  // Clip User Photo to Frame
  ctx.save();
  ctx.beginPath();
  ctx.rect(photoX + 8, photoY + 8, photoW - 16, photoH - 16);
  ctx.clip();

  if (photo.imageObj) {
    drawUserPhoto(ctx, photo, photoX + photoW / 2, photoY + photoH / 2, photoW - 16, photoH - 16);
  } else {
    ctx.fillStyle = '#004726';
    ctx.fillRect(photoX, photoY, photoW, photoH);
    ctx.fillStyle = '#8DC63F';
    ctx.font = 'bold 28px "JetBrains Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DRAG & DROP PHOTO', photoX + photoW / 2, photoY + photoH / 2);
  }
  ctx.restore();

  // Yellow & Pink Framing Corner Badges
  ctx.strokeStyle = '#FFE600';
  ctx.lineWidth = 6;
  ctx.strokeRect(photoX, photoY, photoW, photoH);

  // Corner Accent Triangles
  drawCornerAccents(ctx, photoX, photoY, photoW, photoH);

  // 6. Lower Profile Specifications Card (Name, Title, Team, Stack)
  const cardW = w - 96;
  const cardX = 48;
  const cardY = 800;

  // Pre-calculate Stack / Role Tag wrapping to derive dynamic card height
  const stack = (profile.stack || 'FULLSTACK • AI • WEB3').toUpperCase();
  const maxStackWidth = cardW - 80;
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';

  const wrapStackLines = (text: string, maxWidth: number): string[] => {
    if (!text.trim()) return ['FULLSTACK • AI • WEB3'];

    if (text.includes('•') || text.includes(',')) {
      const rawTags = text.split(/•|,/).map(t => t.trim()).filter(Boolean);
      const lines: string[] = [];
      let currentLine = '';

      for (const tag of rawTags) {
        const testLine = currentLine ? `${currentLine} • ${tag}` : tag;
        if (ctx.measureText(testLine).width <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          if (ctx.measureText(tag).width > maxWidth) {
            const words = tag.split(' ').filter(Boolean);
            let wordLine = '';
            for (const w of words) {
              const testWordLine = wordLine ? `${wordLine} ${w}` : w;
              if (ctx.measureText(testWordLine).width <= maxWidth) {
                wordLine = testWordLine;
              } else {
                if (wordLine) lines.push(wordLine);
                wordLine = w;
              }
            }
            currentLine = wordLine;
          } else {
            currentLine = tag;
          }
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines.length > 0 ? lines : [text];
    }

    const words = text.split(' ').filter(Boolean);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.length > 0 ? lines : [text];
  };

  const stackLines = wrapStackLines(stack, maxStackWidth);
  const lineSpacing = 32;
  const stackTotalHeight = (stackLines.length - 1) * lineSpacing;

  const teamName = profile.teamName ? profile.teamName.trim().toUpperCase() : '';
  const title = (profile.title || 'GOA UNSTOPPABLE BUILDER').toUpperCase();

  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  const titleText = `★ ${title} ★`;
  const titleWidth = ctx.measureText(titleText).width + 36;
  const titlePillW = Math.min(titleWidth, cardW - 80);

  let contentOffset = 0;
  if (teamName) {
    const teamText = `✦ SQUAD: ${teamName}`;
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    const teamWidth = ctx.measureText(teamText).width + 36;
    const teamPillW = Math.min(teamWidth, cardW - 80);
    const teamX = cardX + 40 + titlePillW + 16;

    if (teamX + teamPillW > cardX + cardW - 40) {
      contentOffset = 48; // shift stack section down
    }
  }

  const cardH = Math.max(440, 435 + contentOffset + stackTotalHeight);

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;

  // Main Card Fill
  ctx.fillStyle = cardBg;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.restore();

  // Card Decorative Top Border Line
  ctx.fillStyle = '#FF007A';
  ctx.fillRect(cardX, cardY, cardW, 8);

  // Card Content
  const rawName = profile.name || 'ANONYMOUS HACKER';
  const name = rawName.trim().startsWith('@') ? rawName.trim() : rawName.toUpperCase();
  const passId = profile.passId || '#HH-GOA-2026';

  // A. Builder Name
  ctx.save();
  ctx.fillStyle = cardText;
  ctx.font = '900 44px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(name, cardX + 40, cardY + 65, cardW - 80);

  // B. Auto-Derived Title Badge Pill & Team Badge Pill
  ctx.save();
  // Title Badge Shadow
  ctx.fillStyle = '#121212';
  ctx.beginPath();
  ctx.roundRect(cardX + 40 + 3, cardY + 92 + 3, titlePillW, 40, 10);
  ctx.fill();

  // Title Badge Main Fill
  ctx.fillStyle = badgeBg;
  ctx.beginPath();
  ctx.roundRect(cardX + 40, cardY + 92, titlePillW, 40, 10);
  ctx.fill();

  // Title Badge Black Border
  ctx.strokeStyle = '#121212';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = badgeText;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 19px "JetBrains Mono", monospace';
  ctx.fillText(titleText, cardX + 58, cardY + 112, titlePillW - 36);
  ctx.restore();

  if (teamName) {
    const teamText = `✦ SQUAD: ${teamName}`;
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    const teamWidth = ctx.measureText(teamText).width + 36;
    const teamPillW = Math.min(teamWidth, cardW - 80);

    let teamX = cardX + 40 + titlePillW + 16;
    let teamY = cardY + 92;

    if (teamX + teamPillW > cardX + cardW - 40) {
      teamX = cardX + 40;
      teamY = cardY + 142;
    }

    ctx.save();
    // Squad Badge Shadow
    ctx.fillStyle = '#121212';
    ctx.beginPath();
    ctx.roundRect(teamX + 3, teamY + 3, teamPillW, 40, 10);
    ctx.fill();

    // Squad Badge Fill
    ctx.fillStyle = squadBg;
    ctx.beginPath();
    ctx.roundRect(teamX, teamY, teamPillW, 40, 10);
    ctx.fill();

    // Squad Badge Black Border
    ctx.strokeStyle = '#121212';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = squadText;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText(teamText, teamX + 18, teamY + 20, teamPillW - 36);
    ctx.restore();
  }

  // C. Stack / Role Tag
  ctx.fillStyle = cardText;
  ctx.textBaseline = 'alphabetic';
  ctx.font = 'bold 19px "JetBrains Mono", monospace';
  ctx.fillText('PRIMARY STACK & ROLE:', cardX + 40, cardY + 182 + contentOffset);

  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = profile.theme === 'sunset-yellow' ? '#005C31' : '#FF007A';
  ctx.textBaseline = 'alphabetic';

  stackLines.forEach((lineText, idx) => {
    ctx.fillText(lineText, cardX + 40, cardY + 218 + contentOffset + (idx * lineSpacing));
  });

  // D. Divider Line
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const dividerY = cardY + 252 + contentOffset + stackTotalHeight;
  ctx.moveTo(cardX + 40, dividerY);
  ctx.lineTo(cardX + cardW - 40, dividerY);
  ctx.stroke();

  // E. Footer Pass Specs & Barcode
  const footerIdY = dividerY + 44;
  ctx.font = 'bold 22px "JetBrains Mono", monospace';
  ctx.fillStyle = cardText;
  ctx.fillText(`ID: ${passId}`, cardX + 40, footerIdY);

  ctx.font = '18px "JetBrains Mono", monospace';
  ctx.fillStyle = profile.theme === 'sunset-yellow' ? '#005C31' : '#006838';
  ctx.fillText('GOA, INDIA • 28 - 31 OCT 2026', cardX + 40, footerIdY + 38);

  // Draw Procedural Authentic Barcode on Right of Card
  drawBarcode(ctx, cardX + cardW - 200, footerIdY - 25, 160, 70, cardText);
  ctx.restore();

  // 7. Bottom Branding Line
  ctx.save();
  ctx.fillStyle = '#FFE600';
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('FRAME YOURSELF IN  •  HHGOA.COM', w / 2, h - 28);
  ctx.restore();
}

/**
 * Helper: Draw user photo onto canvas with pan, scale, rotation
 */
function drawUserPhoto(
  ctx: CanvasRenderingContext2D,
  photo: CanvasRenderOptions['photo'],
  centerX: number,
  centerY: number,
  boxWidth: number,
  boxHeight: number
) {
  const { imageObj, scale, panX, panY, rotation } = photo;
  if (!imageObj) return;

  ctx.save();
  // Move context to center point
  ctx.translate(centerX + panX, centerY + panY);

  // Apply rotation
  if (rotation) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  // Calculate object-fit cover base scale
  const imgW = imageObj.width;
  const imgH = imageObj.height;

  // Cover aspect ratio
  const aspectImg = imgW / imgH;
  const aspectBox = boxWidth / boxHeight;

  let renderW = boxWidth;
  let renderH = boxHeight;

  if (aspectImg > aspectBox) {
    renderW = boxHeight * aspectImg;
  } else {
    renderH = boxWidth / aspectImg;
  }

  // Apply user scale zoom multiplier
  renderW *= scale;
  renderH *= scale;

  // Draw centered at origin
  ctx.drawImage(imageObj, -renderW / 2, -renderH / 2, renderW, renderH);

  ctx.restore();
}

/**
 * Helper: Draw "HACKER HOUSE" with "गोवा" badge overlay
 */
function drawHackerHouseBranding(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  scale: number = 1.0
) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);

  // 1. "HACKER HOUSE" in Condensed Tall Yellow Serif
  ctx.fillStyle = '#FFE600';
  ctx.font = '900 115px "Bodoni Moda", "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Draw "HACKER"
  ctx.fillText('HACKER', 0, -50);
  // Draw "HOUSE"
  ctx.fillText('HOUSE', 0, 45);

  // 2. Overlaid "गोवा" Devanagari Floating Text (Matching site logo: Pink text with Yellow outline, no background box)
  ctx.save();
  ctx.rotate(-0.08); // Slight stylish angle

  ctx.font = 'bold 95px "Rozha One", "Tiro Devanagari Marathi", "Noto Sans Devanagari", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Drop shadow for crisp contrast
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  // Yellow stroke outline
  ctx.strokeStyle = '#FFE600';
  ctx.lineWidth = 14;
  ctx.lineJoin = 'round';
  ctx.strokeText('गोवा', 0, 0);

  // Hot pink text fill
  ctx.fillStyle = '#FF007A';
  ctx.fillText('गोवा', 0, 0);

  ctx.restore();

  ctx.restore();
}

/**
 * Helper: Goan tile geometric border ring
 */
function drawGoanBorderRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  ctx.save();
  ctx.strokeStyle = '#FFE600';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#FF007A';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
  ctx.stroke();

  // Draw 24 floral dots around the ring
  const count = 24;
  for (let i = 0; i < count; i++) {
    const angle = (i * Math.PI * 2) / count;
    const px = cx + Math.cos(angle) * (r + 20);
    const py = cy + Math.sin(angle) * (r + 20);

    ctx.fillStyle = i % 2 === 0 ? '#8DC63F' : '#FF007A';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Helper: Goan floral corner foliage
 */
function drawCornerFoliage(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  // Top Left & Top Right Palm Leaf Flourishes
  const drawPalmLeaf = (x: number, y: number, flip: boolean) => {
    ctx.save();
    ctx.translate(x, y);
    if (flip) ctx.scale(-1, 1);

    ctx.strokeStyle = '#8DC63F';
    ctx.lineWidth = 4;
    ctx.fillStyle = '#8DC63F';

    // Stem
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(60, 60, 120, 180);
    ctx.stroke();

    // Fronds
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 18, i * 25);
      ctx.lineTo(i * 18 + 45, i * 25 - 20);
      ctx.lineTo(i * 18 + 20, i * 25 + 10);
      ctx.fill();
    }
    ctx.restore();
  };

  drawPalmLeaf(20, 20, false);
  drawPalmLeaf(w - 20, 20, true);

  ctx.restore();
}

/**
 * Background Palm Tree Vectors
 */
function drawPalmLeavesBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(141, 198, 63, 0.08)';
  ctx.beginPath();
  ctx.arc(0, 0, 300, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(w, h, 350, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Beach & Sunset silhouettes for Builder Pass
 */
function drawBeachSunsetVectors(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();

  // Sunset Sun Arc in top/middle
  ctx.fillStyle = 'rgba(255, 230, 0, 0.12)';
  ctx.beginPath();
  ctx.arc(w / 2, 320, 280, Math.PI, 0);
  ctx.fill();

  // Ocean Wave Lines at bottom
  ctx.strokeStyle = 'rgba(141, 198, 63, 0.2)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const y = h - 250 + i * 40;
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(w / 4, y - 20, w / 2, y);
    ctx.quadraticCurveTo((3 * w) / 4, y + 20, w, y);
  }
  ctx.stroke();

  ctx.restore();
}

/**
 * Traditional Goan Tile Border Strip
 */
function drawTileStrip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = '#8DC63F';
  ctx.fillRect(x, y, w, h);

  const patternW = 30;
  const count = Math.ceil(w / patternW);

  for (let i = 0; i < count; i++) {
    const px = x + i * patternW;

    // Hot pink diamonds
    ctx.fillStyle = '#FF007A';
    ctx.beginPath();
    ctx.moveTo(px + 15, y + 4);
    ctx.lineTo(px + 26, y + h / 2);
    ctx.lineTo(px + 15, y + h - 4);
    ctx.lineTo(px + 4, y + h / 2);
    ctx.closePath();
    ctx.fill();

    // Yellow dots inside
    ctx.fillStyle = '#FFE600';
    ctx.beginPath();
    ctx.arc(px + 15, y + h / 2, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Corner framing accents
 */
function drawCornerAccents(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = '#FF007A';
  const s = 24;

  // TL
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + s, y);
  ctx.lineTo(x, y + s);
  ctx.fill();

  // TR
  ctx.beginPath();
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w - s, y);
  ctx.lineTo(x + w, y + s);
  ctx.fill();

  // BL
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + s, y + h);
  ctx.lineTo(x, y + h - s);
  ctx.fill();

  // BR
  ctx.beginPath();
  ctx.moveTo(x + w, y + h);
  ctx.lineTo(x + w - s, y + h);
  ctx.lineTo(x + w, y + h - s);
  ctx.fill();

  ctx.restore();
}

/**
 * Procedural Barcode
 */
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  const barWidths = [3, 1, 4, 2, 1, 3, 2, 5, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3];
  let currX = x;

  for (let i = 0; i < barWidths.length; i++) {
    const bw = barWidths[i];
    if (i % 2 === 0) {
      ctx.fillRect(currX, y, bw * 2, h - 18);
    }
    currX += bw * 3;
    if (currX > x + w) break;
  }

  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('*HH-GOA-2026*', x, y + h);
  ctx.restore();
}
