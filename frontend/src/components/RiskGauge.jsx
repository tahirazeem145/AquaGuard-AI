import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function RiskGauge({ assessment, isAssessing }) {
  const { t, translateTier } = useLanguage();

  // Extract risk score and contributions from API schemas
  const riskScore = assessment?.composite_risk_score?.final_score ?? assessment?.risk_assessment?.score ?? 0;
  const severityTier = assessment?.composite_risk_score?.severity_tier ?? assessment?.risk_assessment?.severity_tier ?? 'NORMAL';
  const visualContrib = assessment?.composite_risk_score?.visual_disease_contribution ?? assessment?.risk_assessment?.visual_contribution ?? 0;
  const envContrib = assessment?.composite_risk_score?.environmental_hazard_contribution ?? assessment?.risk_assessment?.environmental_contribution ?? 0;
  const synergyPenalty = assessment?.composite_risk_score?.biological_synergy_penalty ?? assessment?.risk_assessment?.synergy_bonus ?? 0;
  const synergyDetected = assessment?.biological_synergy?.synergy_detected ?? assessment?.synergy_interaction?.synergy_detected ?? false;
  const synergyExplanation = assessment?.biological_synergy?.explanation ?? assessment?.synergy_interaction?.explanation ?? '';
  const guardrailTriggered = assessment?.water_quality?.biological_guardrail_triggered ?? assessment?.environmental_health?.biological_guardrail_triggered ?? false;

  // Clamped score 0 to 100
  const clampedScore = Math.max(0, Math.min(100, Number(riskScore) || 0));

  // Geometry: 250 degree circular arc matching Figma dashboard gauge
  const cx = 130;
  const cy = 115;
  const r = 86;
  const startAngle = 145;
  const sweepAngle = 250;

  // Arc stroke length calculation
  const arcLength = 2 * Math.PI * r * (sweepAngle / 360);
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = arcLength - (clampedScore / 100) * arcLength;

  // Current score angle and coordinates for the glowing indicator pip
  const currentAngle = startAngle + (clampedScore / 100) * sweepAngle;
  const currentRad = (currentAngle * Math.PI) / 180;
  const pipX = cx + r * Math.cos(currentRad);
  const pipY = cy + r * Math.sin(currentRad);

  // Outer indicator pointer coordinates
  const pointerX = cx + (r + 10) * Math.cos(currentRad);
  const pointerY = cy + (r + 10) * Math.sin(currentRad);

  const simpleTier = translateTier(severityTier);

  // Figma Palette: Electric Lime for Normal, Warm Amber for Advisory, Orange for Warning, Coral for Emergency
  let tierColor = '#b4f03a';
  let tierBg = 'rgba(180, 240, 58, 0.12)';
  let tierBorder = 'rgba(180, 240, 58, 0.35)';
  let tierClass = 'status-normal';
  let TierIcon = ShieldCheck;

  if (severityTier === 'ADVISORY') {
    tierColor = '#f59e0b';
    tierBg = 'rgba(245, 158, 11, 0.12)';
    tierBorder = 'rgba(245, 158, 11, 0.35)';
    tierClass = 'status-advisory';
    TierIcon = Info;
  } else if (severityTier === 'WARNING') {
    tierColor = '#f97316';
    tierBg = 'rgba(249, 115, 22, 0.14)';
    tierBorder = 'rgba(249, 115, 22, 0.40)';
    tierClass = 'status-warning';
    TierIcon = AlertTriangle;
  } else if (severityTier === 'EMERGENCY') {
    tierColor = '#f43f5e';
    tierBg = 'rgba(244, 63, 94, 0.16)';
    tierBorder = 'rgba(244, 63, 94, 0.45)';
    tierClass = 'status-emergency';
    TierIcon = AlertOctagon;
  }

  // Ticks at 0, 25, 50, 75, 100
  const ticks = [
    { pct: 0, label: '0' },
    { pct: 25, label: '25' },
    { pct: 50, label: '50' },
    { pct: 75, label: '75' },
    { pct: 100, label: '100' }
  ];

  return (
    <div className="card-panel" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Sparkles size={15} color="#b4f03a" />
          <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.04em', color: '#f1f5f9', textTransform: 'uppercase' }}>
            {t('danger_level_title')}
          </span>
        </div>

        <span className={`status-pill ${tierClass}`} style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
          <TierIcon size={12} />
          {simpleTier}
        </span>
      </div>

      <p style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textAlign: 'left', marginBottom: '0.85rem' }}>
        {t('danger_level_sub')}
      </p>

      {/* SVG Radial Arc Gauge Container */}
      <div style={{ position: 'relative', width: '260px', height: '200px', margin: '0 auto' }}>
        <svg viewBox="0 0 260 210" width="100%" height="100%" style={{ overflow: 'visible' }}>
          <defs>
            {/* Multi-tier gradient track: Electric Lime -> Amber -> Orange -> Coral */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b4f03a" />
              <stop offset="30%" stopColor="#a3e635" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="78%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 59.5 164.3 A 86 86 0 1 1 200.5 164.3"
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Scale Tick Markers along arc */}
          {
            ticks.map((t) => {
              const angle = startAngle + (t.pct / 100) * sweepAngle;
              const rad = (angle * Math.PI) / 180;
              const innerX = cx + (r - 10) * Math.cos(rad);
              const innerY = cy + (r - 10) * Math.sin(rad);
              const outerX = cx + (r + 10) * Math.cos(rad);
              const outerY = cy + (r + 10) * Math.sin(rad);
              const textX = cx + (r + 22) * Math.cos(rad);
              const textY = cy + (r + 22) * Math.sin(rad);

              return (
                <g key={t.pct} opacity="0.65">
                  <line
                    x1={innerX}
                    y1={innerY}
                    x2={outerX}
                    y2={outerY}
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={textX}
                    y={textY + 3.5}
                    fontSize="9.5"
                    fontFamily="var(--font-sans)"
                    fontWeight="500"
                    fill="#94a3b8"
                    textAnchor="middle"
                  >
                    {t.label}
                  </text>
                </g>
              );
            })}

          {/* Active Filled Progress Arc */}
          <path
            d="M 59.5 164.3 A 86 86 0 1 1 200.5 164.3"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`
            }
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: clampedScore > 40 ? 'url(#gaugeGlow)' : 'none'
            }}
          />

          {/* Glowing Target Pointer / Pip on Track */}
          <circle
            cx={pipX}
            cy={pipY}
            r="10"
            fill={tierColor}
            opacity="0.35"
            style={{ transition: 'cx 0.8s cubic-bezier(0.4, 0, 0.2, 1), cy 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          <circle
            cx={pipX}
            cy={pipY}
            r="5"
            fill={tierColor}
            stroke="#030407"
            strokeWidth="2"
            style={{ transition: 'cx 0.8s cubic-bezier(0.4, 0, 0.2, 1), cy 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />

          {/* Outer Indicator Pip */}
          <circle
            cx={pointerX}
            cy={pointerY}
            r="2"
            fill={tierColor}
            style={{ transition: 'cx 0.8s cubic-bezier(0.4, 0, 0.2, 1), cy 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />

          {/* Center Digital Readout (Unobstructed, centered inside the circular arc) */}
          <text
            x={cx}
            y={cy - 22}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fontFamily="var(--font-sans)"
            fill="#94a3b8"
            letterSpacing="0.08em"
          >
            {t('meter_label')}
          </text>

          {/* Main Large Score Number - Normal round sans-serif font */}
          <text
            x={cx}
            y={cy + 18}
            textAnchor="middle"
            fontSize="46"
            fontWeight="800"
            fontFamily="var(--font-sans)"
            fill={tierColor}
            style={{
              transition: 'fill 0.4s ease',
              filter: `drop-shadow(0 0 12px ${tierColor}55)`
            }}
          >
            {clampedScore.toFixed(0)}
          </text>

          {/* Out of 100 Scale */}
          <text
            x={cx}
            y={cy + 36}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fontFamily="var(--font-sans)"
            fill="#94a3b8"
          >
            / 100
          </text>

          {/* Embedded Tier Pill Badge */}
          <g transform={`translate(${cx - 52}, ${cy + 46})`}>
            <rect
              width="104"
              height="20"
              rx="10"
              fill={tierBg}
              stroke={tierBorder}
              strokeWidth="1"
            />
            <text
              x="52"
              y="13.5"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fontFamily="var(--font-sans)"
              fill={tierColor}
              letterSpacing="0.04em"
            >
              {simpleTier}
            </text>
          </g>
        </svg>
      </div >

      {/* Biological Guardrail Callout */}
      {guardrailTriggered && (
        <div style={{
          marginTop: '0.85rem',
          padding: '0.65rem 0.85rem',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.45)',
          borderRadius: '12px',
          fontSize: '0.75rem',
          color: '#fecdd3',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.55rem',
          backdropFilter: 'blur(10px)'
        }}>
          <AlertOctagon size={16} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#f43f5e' }}>{simpleTier}:</strong> {t('emergency_alert')}
          </div>
        </div >
      )
      }

      {/* Synergy Interaction Callout */}
      {
        synergyDetected && (
          <div style={{
            marginTop: '0.65rem',
            padding: '0.65rem 0.85rem',
            background: 'rgba(249, 115, 22, 0.12)',
            border: '1px solid rgba(249, 115, 22, 0.40)',
            borderRadius: '12px',
            fontSize: '0.75rem',
            color: '#fed7aa',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.55rem',
            backdropFilter: 'blur(10px)'
          }}>
            <Zap size={16} color="#f97316" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#f97316' }}>{t('synergy_alert', { pts: synergyPenalty.toFixed(0) })}</strong>
            </div>
          </div >
        )
      }

      {/* Tri-Factor Component Contribution Breakdown (Frosted Glass Cards with Figma Palette) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '0.65rem',
        marginTop: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '0.85rem'
      }}>
        {/* Visual Pathology Weight: Royal Violet */}
        <div className="metric-box" style={{ padding: '0.55rem 0.65rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '600' }}>
              {t('fish_health_contrib')}
            </span>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#a78bfa', margin: '0.2rem 0' }}>
            {visualContrib.toFixed(1)} <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>pts</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (visualContrib / 55) * 100)}%`, background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)', borderRadius: '2px' }} />
          </div>
        </div>

        {/* Water Telemetry Weight: Electric Lime */}
        <div className="metric-box" style={{ padding: '0.55rem 0.65rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '600' }}>
              {t('water_quality_contrib')}
            </span>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#b4f03a', margin: '0.2rem 0' }}>
            {envContrib.toFixed(1)} <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>pts</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (envContrib / 45) * 100)}%`, background: 'linear-gradient(90deg, #84cc16, #b4f03a)', borderRadius: '2px' }} />
          </div>
        </div>

        {/* Synergy Penalty Bonus */}
        <div className="metric-box" style={{ padding: '0.55rem 0.65rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '600' }}>
              {t('extra_risk_contrib')}
            </span>
          </div>
          <div style={{
            fontSize: '1.15rem',
            fontWeight: '800',
            fontFamily: 'var(--font-sans)',
            color: synergyPenalty > 0 ? '#f97316' : synergyPenalty < 0 ? '#b4f03a' : 'var(--text-dim)',
            margin: '0.2rem 0'
          }}>
            {synergyPenalty > 0 ? `+${synergyPenalty.toFixed(0)}` : synergyPenalty < 0 ? `${synergyPenalty.toFixed(0)}` : '0'} <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>pts</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (synergyPenalty / 25) * 100)}%`, background: synergyPenalty > 0 ? '#f97316' : '#b4f03a', borderRadius: '2px' }} />
          </div>
        </div>
      </div>

    </div >
  );
}
