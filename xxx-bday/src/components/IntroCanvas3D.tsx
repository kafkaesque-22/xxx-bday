import React, { useEffect, useRef } from "react";

interface HairNode3D {
  wx: number; // Current world coordinate X
  wy: number; // Current world coordinate Y
  wz: number; // Current world coordinate Z
  vx: number; // Velocity X
  vy: number; // Velocity Y
  vz: number; // Velocity Z
  ox: number; // Target base coordinate X
  oy: number; // Target base coordinate Y
  oz: number; // Target base coordinate Z
}

interface HairStrand3D {
  nodes: HairNode3D[];
  rootColor: string;
  midColor: string;
  shineColor: string;
  tipColor: string;
  thickness: number;
  alpha: number;
}

export default function IntroCanvas3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ 
    x: 0, 
    y: 0, 
    rx: 0, 
    ry: 0, 
    targetRx: 0, 
    targetRy: 0, 
    isDown: false, 
    active: false 
  });
  
  const strandsRef = useRef<HairStrand3D[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth || 300;
    let height = canvas.height = canvas.offsetHeight || 500;

    // Premium, vibrant, modern hair-dye color palettes (Ombre Root -> Mid -> Glossy Shine -> Tip)
    const hairPalettes = [
      { 
        root: "#230635", // Deep Eggplant Root
        mid: "#ff007f",  // Vibrant Hot Pink
        shine: "#ff85a2", // Soft Pastel Rose Shine
        tip: "#ffd3e8"   // Baby Pink Tip
      },
      { 
        root: "#061329", // Indigo Midnight Root
        mid: "#00b4d8",  // Bright Ocean Turquoise
        shine: "#90e0ef", // Soft Turquoise Shine
        tip: "#caf0f8"   // Icy Silver Blue Tip
      },
      { 
        root: "#220835", // Deep Grape Root
        mid: "#9d4edd",  // Amethyst Purple
        shine: "#e0aaff", // Lavender Shine
        tip: "#f3e8ff"   // Cotton Candy Lilac Tip
      },
      { 
        root: "#2d0a0a", // Espresso Cherry Root
        mid: "#e63946",  // Vibrant Crimson
        shine: "#f1faee", // Bright Champagne Shine
        tip: "#ffccd5"   // Coral Peach Tip
      }
    ];

    const strands: HairStrand3D[] = [];
    
    // Scale size dynamically based on screen viewport dimensions
    const baseDimension = Math.min(width, height);
    const isMobile = width < 768;
    const sizeScale = isMobile ? 1.15 : 1.5;

    // Dimensions of each "X"
    const halfWidth = Math.floor(width * 0.12 * sizeScale);
    const halfHeight = Math.floor(height * 0.27 * sizeScale);
    const depth = Math.floor(baseDimension * 0.03 * sizeScale);
    const spacing = Math.floor(width * 0.32 * sizeScale); // Distance between centers of XXX

    // Each 'X' is composed of two intersecting diagonal locks.
    // To make it look like actual hair (and NOT worms or fuzzy clouds):
    // 1. Strands must run FULL length along the diagonals.
    // 2. We use many EXTREMELY FINE, ultra-thin parallel fibers (0.4px to 0.8px) packed closely together.
    // 3. We keep them almost straight with only a very tiny organic wave, so they form a crisp, recognizable "X" shape.
    const fibersPerBundle = isMobile ? 70 : 120; // High fiber density for a luxurious, silky look
    const nodesPerStrand = 15; // High node count for fluid, organic bending

    // Calculate perpendicular unit vectors to offset parallel hair fibers laterally
    const dx = halfWidth * 2;
    const dy = halfHeight * 2;
    const diagonalLen = Math.sqrt(dx * dx + dy * dy) || 1;
    
    // Normal vector for Diagonal 1 (Top-Left to Bottom-Right)
    const nx1 = -dy / diagonalLen;
    const ny1 = dx / diagonalLen;

    // Normal vector for Diagonal 2 (Top-Right to Bottom-Left)
    const nx2 = dy / diagonalLen;
    const ny2 = dx / diagonalLen;

    for (let xIdx = 0; xIdx < 3; xIdx++) {
      const cx = (xIdx - 1) * spacing; // Centers of the three letters
      const palette = hairPalettes[xIdx % hairPalettes.length];

      // --- Diagonal 1 ---
      for (let f = 0; f < fibersPerBundle; f++) {
        const nodes: HairNode3D[] = [];
        // Evenly space hair fibers across the width of the hair lock
        const lateralOffset = (f / (fibersPerBundle - 1) - 0.5) * (isMobile ? 22 : 36);
        const fiberDepth = (Math.random() - 0.5) * depth;

        // Individual hair fiber waviness parameters
        const wavePhase = (f * 0.1) + Math.random() * 0.3;
        const waveAmp = 1.8 + Math.random() * 1.5; // Very subtle waviness so it looks like straight, silky hair

        for (let n = 0; n < nodesPerStrand; n++) {
          const t = -1 + 2 * (n / (nodesPerStrand - 1)); // -1 (Root/Top) to 1 (Tip/Bottom)

          // Perfect straight line along the diagonal
          const lx = t * halfWidth;
          const ly = t * halfHeight;

          // Add a tiny sine wave along the fiber for natural hair texture
          const wave = Math.sin(t * Math.PI * 2 + wavePhase) * waveAmp;

          const ox = cx + lx + nx1 * (lateralOffset + wave);
          const oy = ly + ny1 * (lateralOffset + wave);
          const oz = fiberDepth + (Math.sin(t * Math.PI) * 3);

          // Scattered initial positions for an elegant assembly transition on page load
          const scatter = 750;
          const wx = ox + (Math.random() - 0.5) * scatter;
          const wy = oy + (Math.random() - 0.5) * scatter;
          const wz = oz + (Math.random() - 0.5) * scatter;

          nodes.push({
            wx, wy, wz,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            vz: (Math.random() - 0.5) * 5,
            ox, oy, oz
          });
        }

        strands.push({
          nodes,
          rootColor: palette.root,
          midColor: palette.mid,
          shineColor: palette.shine,
          tipColor: palette.tip,
          thickness: 0.3 + Math.random() * 0.4, // Extremely fine realistic hair fibers
          alpha: 0.22 + Math.random() * 0.25    // High translucency creates beautiful silky overlay depth
        });
      }

      // --- Diagonal 2 ---
      for (let f = 0; f < fibersPerBundle; f++) {
        const nodes: HairNode3D[] = [];
        const lateralOffset = (f / (fibersPerBundle - 1) - 0.5) * (isMobile ? 22 : 36);
        const fiberDepth = (Math.random() - 0.5) * depth;

        const wavePhase = (f * 0.1) + Math.random() * 0.3 + Math.PI;
        const waveAmp = 1.8 + Math.random() * 1.5;

        for (let n = 0; n < nodesPerStrand; n++) {
          const t = -1 + 2 * (n / (nodesPerStrand - 1));

          const lx = -t * halfWidth;
          const ly = t * halfHeight;

          const wave = Math.sin(t * Math.PI * 2 + wavePhase) * waveAmp;

          const ox = cx + lx + nx2 * (lateralOffset + wave);
          const oy = ly + ny2 * (lateralOffset + wave);
          const oz = fiberDepth + (Math.sin(t * Math.PI) * 3);

          const scatter = 750;
          const wx = ox + (Math.random() - 0.5) * scatter;
          const wy = oy + (Math.random() - 0.5) * scatter;
          const wz = oz + (Math.random() - 0.5) * scatter;

          nodes.push({
            wx, wy, wz,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            vz: (Math.random() - 0.5) * 5,
            ox, oy, oz
          });
        }

        strands.push({
          nodes,
          rootColor: palette.root,
          midColor: palette.mid,
          shineColor: palette.shine,
          tipColor: palette.tip,
          thickness: 0.3 + Math.random() * 0.4, // Fine silky fibers
          alpha: 0.22 + Math.random() * 0.25
        });
      }
    }

    strandsRef.current = strands;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Track mouse & touch coordinates for blowing/brushing hair interaction
    const updateMousePos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const mx = clientX - rect.left - width / 2;
      const my = clientY - rect.top - height / 2;
      
      const m = mouseRef.current;
      m.x = mx;
      m.y = my;
      m.active = true;

      // Rotate target based on mouse coordinates
      m.targetRx = (my / height) * Math.PI * 0.25;
      m.targetRy = (mx / width) * Math.PI * 0.25;
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMousePos(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      updateMousePos(touch.clientX, touch.clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDown = true;
      updateMousePos(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      mouseRef.current.isDown = true;
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateMousePos(touch.clientX, touch.clientY);
      }
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    const handleMouseLeave = () => {
      const m = mouseRef.current;
      m.targetRx = 0;
      m.targetRy = 0;
      m.active = false;
      m.isDown = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchend", handleMouseLeave);

    const focalLength = 300;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const m = mouseRef.current;
      m.rx += (m.targetRx - m.rx) * 0.06;
      m.ry += (m.targetRy - m.ry) * 0.06;

      time += 0.009;

      // Continuous elegant rotation around its vertical axis to display the stunning 3D volume of the silky hair letters
      const yawAngle = m.ry + (time * 0.45); 
      const pitchWobble = Math.cos(time * 0.4) * 0.04;
      const pitchAngle = m.rx + 0.08 + pitchWobble;

      const cosX = Math.cos(pitchAngle);
      const sinX = Math.sin(pitchAngle);
      const cosY = Math.cos(yawAngle);
      const sinY = Math.sin(yawAngle);

      const floatBob = Math.sin(time * 0.85) * 5; // Beautiful floating motion

      // Canvas setup for additive glowing hair strokes
      ctx.globalCompositeOperation = "screen";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      const strandsArray = strandsRef.current;
      const strandsLen = strandsArray.length;

      // Update positions with Spring Physics and Hair-dryer / blow forces
      for (let i = 0; i < strandsLen; i++) {
        const strand = strandsArray[i];
        const nodesLen = strand.nodes.length;

        for (let j = 0; j < nodesLen; j++) {
          const node = strand.nodes[j];

          // Rotate original coordinate targets in 3D
          const rx1 = node.ox * cosY - node.oz * sinY;
          const rz1 = node.ox * sinY + node.oz * cosY;

          const ry2 = node.oy * cosX - rz1 * sinX;
          const rz2 = node.oy * sinX + rz1 * cosX;

          // Roots stay very stable, hair tips flow with extreme freedom
          const isRoot = j === 0 || j === nodesLen - 1; // Both ends of the diagonal strands stay anchored to keep "X" shape crisp
          const springK = isRoot ? 0.22 : 0.09;
          const damping = isRoot ? 0.70 : 0.86;

          const ax = (rx1 - node.wx) * springK;
          const ay = (ry2 - node.wy) * springK;
          const az = (rz2 - node.wz) * springK;

          node.vx = (node.vx + ax) * damping;
          node.vy = (node.vy + ay) * damping;
          node.vz = (node.vz + az) * damping;

          // Gentle hair salon breeze blowing through the locks
          const breeze = time * 2.2 + i * 0.03 + j * 0.12;
          node.vx += Math.sin(breeze) * (0.12 + j * 0.05);
          node.vy += Math.cos(breeze * 0.85) * (0.07 + j * 0.03);

          // Interactive blow / push force from brush/comb/dryer
          if (m.active) {
            const scale = focalLength / (focalLength + node.wz + 180);
            const projX = node.wx * scale;
            const projY = node.wy * scale;

            const dx = projX - m.x;
            const dy = projY - m.y;
            const distSq = dx * dx + dy * dy;

            const blowRadius = m.isDown ? 140 : 80;
            const blowRadiusSq = blowRadius * blowRadius;

            if (distSq < blowRadiusSq) {
              const dist = Math.sqrt(distSq) || 0.1;
              const force = (blowRadius - dist) / blowRadius;
              const blowAngle = Math.atan2(dy, dx);
              const tipFactor = 0.2 + Math.sin((j / (nodesLen - 1)) * Math.PI) * 0.8;
              const blast = m.isDown ? force * 9.5 * tipFactor : force * 3.8 * tipFactor;

              node.vx += Math.cos(blowAngle) * blast;
              node.vy += Math.sin(blowAngle) * blast;
              node.vz += (Math.random() - 0.5) * blast * 1.5;
            }
          }

          node.wx += node.vx;
          node.wy += node.vy;
          node.wz += node.vz;
        }
      }

      // Draw the beautiful hair fibers
      for (let i = 0; i < strandsLen; i++) {
        const strand = strandsArray[i];
        const nodesLen = strand.nodes.length;

        // Project nodes into 2D viewport coordinates
        const proj: { x: number; y: number; scale: number }[] = [];
        for (let j = 0; j < nodesLen; j++) {
          const node = strand.nodes[j];
          const scale = focalLength / (focalLength + node.wz + 180);
          const finalX = node.wx * scale + width / 2;
          const finalY = node.wy * scale + height / 2 + floatBob;
          proj.push({ x: finalX, y: finalY, scale });
        }

        ctx.beginPath();
        ctx.moveTo(proj[0].x, proj[0].y);

        // Render silky locks using quadratic curves for smooth hair flow
        for (let j = 1; j < nodesLen - 1; j++) {
          const xc = (proj[j].x + proj[j + 1].x) / 2;
          const yc = (proj[j].y + proj[j + 1].y) / 2;
          ctx.quadraticCurveTo(proj[j].x, proj[j].y, xc, yc);
        }
        ctx.lineTo(proj[nodesLen - 1].x, proj[nodesLen - 1].y);

        // Magnificent multi-stop hair-dye ombre gradient with professional gloss shine
        const gradient = ctx.createLinearGradient(
          proj[0].x, proj[0].y,
          proj[nodesLen - 1].x, proj[nodesLen - 1].y
        );
        gradient.addColorStop(0.0, strand.rootColor);
        gradient.addColorStop(0.35, strand.midColor);
        gradient.addColorStop(0.50, strand.shineColor); // Specular gloss highlight band
        gradient.addColorStop(0.65, strand.midColor);
        gradient.addColorStop(1.0, strand.tipColor);

        ctx.strokeStyle = gradient;
        
        // Fine silky fibers thickness
        const avgScale = proj[nodesLen - 1].scale;
        ctx.lineWidth = strand.thickness * avgScale;
        ctx.globalAlpha = strand.alpha;
        ctx.stroke();

        // Extra white silk glow highlight overlay on every 12th strand to represent high-gloss healthy hair sheen
        if (i % 12 === 0) {
          ctx.beginPath();
          ctx.moveTo(proj[2].x, proj[2].y);
          for (let j = 3; j < nodesLen - 2; j++) {
            const xc = (proj[j].x + proj[j + 1].x) / 2;
            const yc = (proj[j].y + proj[j + 1].y) / 2;
            ctx.quadraticCurveTo(proj[j].x, proj[j].y, xc, yc);
          }
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = (strand.thickness * 0.5) * avgScale;
          ctx.globalAlpha = 0.18;
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = "source-over";

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleMouseLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden z-0 bg-transparent">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
        id="intro-3d-canvas"
      />
    </div>
  );
}
