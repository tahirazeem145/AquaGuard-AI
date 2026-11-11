import React, { useMemo, useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * AmbientRibbonBackground
 * High-performance GSAP-animated vector wave ribbon background.
 * Replicates the pitch-black obsidian aesthetic with vibrant flowing ribbons from
 * user reference (media_1793506997616_3f3bd4b7.jpg and media_1793507905345_343e66f4.png).
 *
 * GSAP Animations:
 * 1. Stream Flow: Pulses & dashes slowly travel along the paths from one end to the other end.
 * 2. Harmonic S-Wave Undulation: Phase-staggered ripple swaying across the 32 parallel lines.
 * 3. Spatial Drift: The ribbon groups slowly translate from one side of the canvas to another.
 * 4. Ambient Glow Breathing: Radial gradient light fields softly expand and contract.
 */
export default function AmbientRibbonBackground() {
  const containerRef = useRef(null);

  // Generate 32 harmonic spline paths for Left Ribbon (Violet / Magenta / Pink)
  const leftRibbonPaths = useMemo(() => {
    const paths = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      // Smooth parabolic density and spacing
      const yOffset = -50 + i * 13;
      const xOffset = -70 + i * 10;
      const amp1 = 125 + Math.sin(t * Math.PI) * 45;
      const amp2 = 145 - Math.cos(t * Math.PI) * 35;

      // Spline coordinates sweeping diagonally across 1920x1080 viewBox
      const startX = -140 + xOffset * 0.8;
      const startY = 1180 + yOffset;
      const cp1x = 190 + xOffset + amp1 * 0.4;
      const cp1y = 880 - amp1;
      const cp2x = 360 + xOffset - amp2 * 0.5;
      const cp2y = 630 + amp2;
      const endX = 740 + xOffset * 1.2;
      const endY = 470 + yOffset * 0.7;
      const cp3x = 900 + xOffset;
      const cp3y = 390 - amp1 * 0.3;
      const finalX = 1080 + xOffset * 0.9;
      const finalY = 430 + yOffset * 0.5;

      const d = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)} S ${cp3x.toFixed(1)} ${cp3y.toFixed(1)}, ${finalX.toFixed(1)} ${finalY.toFixed(1)}`;
      const opacity = 0.22 + 0.68 * Math.sin(t * Math.PI);
      const width = 1.0 + 0.9 * Math.sin(t * Math.PI);

      paths.push({ d, opacity, width, id: `left-ribbon-${i}`, index: i });
    }
    return paths;
  }, []);

  // Generate 32 harmonic spline paths for Right Ribbon (Crimson / Flame Orange / Amber / Gold)
  const rightRibbonPaths = useMemo(() => {
    const paths = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const yOffset = -60 + i * 12;
      const xOffset = -80 + i * 11;
      const amp1 = 135 + Math.cos(t * Math.PI) * 50;
      const amp2 = 155 - Math.sin(t * Math.PI) * 40;

      // Spline coordinates swooping from top-right across right & center
      const startX = 2080 + xOffset * 0.7;
      const startY = -90 + yOffset;
      const cp1x = 1700 + xOffset - amp1 * 0.6;
      const cp1y = 130 + amp1;
      const cp2x = 1430 + xOffset + amp2 * 0.5;
      const cp2y = 350 - amp2 * 0.8;
      const endX = 1250 + xOffset * 0.9;
      const endY = 570 + yOffset * 0.6;
      const cp3x = 1090 + xOffset;
      const cp3y = 790 + amp1 * 0.4;
      const finalX = 1400 + xOffset * 1.1;
      const finalY = 990 + yOffset * 0.7;

      const d = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)} S ${cp3x.toFixed(1)} ${cp3y.toFixed(1)}, ${finalX.toFixed(1)} ${finalY.toFixed(1)}`;
      const opacity = 0.24 + 0.70 * Math.sin(t * Math.PI);
      const width = 1.0 + 0.9 * Math.sin(t * Math.PI);

      paths.push({ d, opacity, width, id: `right-ribbon-${i}`, index: i });
    }
    return paths;
  }, []);

  // GSAP Animation lifecycle
  useEffect(() => {
    if (!containerRef.current) return;

    // Use GSAP context for safe cleanup in React 19
    const ctx = gsap.context(() => {
      // 1. Ultra-slow, serene flow of pure gradient particle dashes along the curves (Zero white lines)
      // Left ribbon flow (from bottom-left upwards to center)
      gsap.to('.left-stream-dots', {
        strokeDashoffset: -1800,
        duration: 65,
        repeat: -1,
        ease: 'none',
        stagger: {
          each: 0.45,
          repeat: -1
        }
      });

      // Right ribbon flow (from top-right downwards to bottom-center)
      gsap.to('.right-stream-dots', {
        strokeDashoffset: 1800,
        duration: 70,
        repeat: -1,
        ease: 'none',
        stagger: {
          each: 0.48,
          repeat: -1
        }
      });

      // 2. Harmonic wave undulation: lines slowly sway and ripple from one end of the cluster to the other
      gsap.to('.left-base-line', {
        x: (i) => Math.sin(i * 0.22) * 36,
        y: (i) => Math.cos(i * 0.22) * 28,
        duration: 26,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.42,
          yoyo: true,
          repeat: -1
        }
      });

      gsap.to('.right-base-line', {
        x: (i) => -Math.sin(i * 0.22) * 38,
        y: (i) => Math.cos(i * 0.22) * 30,
        duration: 28,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.42,
          yoyo: true,
          repeat: -1
        }
      });

      // 3. Ambient glow field slow breathing
      gsap.to('#purpleAmbientGlow', {
        attr: { cx: '22%', cy: '68%', r: '46%' },
        duration: 36,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });

      gsap.to('#orangeAmbientGlow', {
        attr: { cx: '76%', cy: '30%', r: '48%' },
        duration: 40,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: '#030407',
        width: '100vw',
        height: '100vh',
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        contain: 'strict'
      }}
    >
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      >
        <defs>
          {/* Violet / Magenta / Pink Gradient for Left Ribbon */}
          <linearGradient id="violetRibbonGrad" x1="0%" y1="100%" x2="70%" y2="20%">
            <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.4" />
            <stop offset="25%" stopColor="#7c3aed" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#c026d3" stopOpacity="1" />
            <stop offset="85%" stopColor="#ec4899" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
          </linearGradient>

          {/* Fiery Crimson / Flame Orange / Radiant Gold Gradient for Right Ribbon */}
          <linearGradient id="orangeRibbonGrad" x1="100%" y1="0%" x2="20%" y2="80%">
            <stop offset="0%" stopColor="#be123c" stopOpacity="0.5" />
            <stop offset="20%" stopColor="#e11d48" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#ea580c" stopOpacity="1" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="1" />
            <stop offset="90%" stopColor="#eab308" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#a3e635" stopOpacity="0.8" />
          </linearGradient>

          {/* Large Atmospheric Radial Ambient Glow Fields */}
          <radialGradient id="purpleAmbientGlow" cx="18%" cy="72%" r="42%">
            <stop offset="0%" stopColor="#9333ea" stopOpacity="0.32" />
            <stop offset="40%" stopColor="#c026d3" stopOpacity="0.18" />
            <stop offset="70%" stopColor="#7c3aed" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#030407" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="orangeAmbientGlow" cx="80%" cy="26%" r="45%">
            <stop offset="0%" stopColor="#ea580c" stopOpacity="0.30" />
            <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.16" />
            <stop offset="75%" stopColor="#eab308" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#030407" stopOpacity="0" />
          </radialGradient>

          {/* Central Deep Field Subtlety */}
          <radialGradient id="centerAbyssVignette" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="70%" stopColor="#030407" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#010203" stopOpacity="0.85" />
          </radialGradient>

          {/* SVG Glow Filter for Enhanced Neon Bloom */}
          <filter id="neonBloom" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3.0" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Deep Black Obsidian Base */}
        <rect width="1920" height="1080" fill="#030407" />

        {/* Ambient Glow Atmosphere Behind Mesh Ribbons */}
        <rect width="1920" height="1080" fill="url(#purpleAmbientGlow)" />
        <rect width="1920" height="1080" fill="url(#orangeAmbientGlow)" />

        {/* Left Glowing Ribbon Wave Mesh Group */}
        <g className="ambient-ribbon-left-group" filter="url(#neonBloom)">
          {/* Base Silk Lines */}
          {leftRibbonPaths.map((p) => (
            <path
              key={p.id}
              className="left-base-line"
              d={p.d}
              fill="none"
              stroke="url(#violetRibbonGrad)"
              strokeWidth={p.width}
              strokeOpacity={p.opacity}
              strokeLinecap="round"
            />
          ))}

          {/* Stippled Particle Accent Lines (Matches User Screenshot Texture) */}
          {leftRibbonPaths.filter((_, idx) => idx % 2 === 0).map((p) => (
            <path
              key={`dot-${p.id}`}
              className="left-stream-dots"
              d={p.d}
              fill="none"
              stroke="url(#violetRibbonGrad)"
              strokeWidth={1.2}
              strokeOpacity={0.7}
              strokeDasharray="4 8"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Right Glowing Ribbon Wave Mesh Group */}
        <g className="ambient-ribbon-right-group" filter="url(#neonBloom)">
          {/* Base Silk Lines */}
          {rightRibbonPaths.map((p) => (
            <path
              key={p.id}
              className="right-base-line"
              d={p.d}
              fill="none"
              stroke="url(#orangeRibbonGrad)"
              strokeWidth={p.width}
              strokeOpacity={p.opacity}
              strokeLinecap="round"
            />
          ))}

          {/* Stippled Particle Accent Lines (Matches User Screenshot Texture) */}
          {rightRibbonPaths.filter((_, idx) => idx % 2 === 0).map((p) => (
            <path
              key={`dot-${p.id}`}
              className="right-stream-dots"
              d={p.d}
              fill="none"
              stroke="url(#orangeRibbonGrad)"
              strokeWidth={1.2}
              strokeOpacity={0.7}
              strokeDasharray="4 8"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Outer Vignette for Cinematic Depth */}
        <rect width="1920" height="1080" fill="url(#centerAbyssVignette)" />
      </svg>
    </div>
  );
}
