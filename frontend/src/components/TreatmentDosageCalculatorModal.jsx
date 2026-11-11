import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Scale,
  Droplet,
  Wind,
  Layers,
  Sparkles,
  Check,
  Copy,
  Info,
  Waves
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function TreatmentDosageCalculatorModal({
  isOpen,
  onClose,
  currentPondName = 'Nursery Pond Alpha',
  selectedPond = 'pond_01',
  telemetry = { ph: 7.2, dissolved_oxygen_mg_l: 5.5, temperature_c: 27.5, total_ammonia_mg_l: 0.25 },
  initialTreatment = 'salt_pond'
}) {
  const { t } = useLanguage();

  // Plain English fallback helper to guarantee no raw keys appear
  const tr = (key, fallback) => {
    try {
      const val = t(key);
      return (val && val !== key) ? val : fallback;
    } catch {
      return fallback;
    }
  };

  // Unit mode: 'meters' | 'feet'
  const [unitMode, setUnitMode] = useState('meters');

  // Pond dimensions (defaults customized per typical nursery/growout ponds)
  const [length, setLength] = useState(() => (selectedPond === 'pond_02' ? 40 : selectedPond === 'pond_03' ? 30 : 20));
  const [width, setWidth] = useState(() => (selectedPond === 'pond_02' ? 20 : selectedPond === 'pond_03' ? 15 : 10));
  const [depth, setDepth] = useState(() => (selectedPond === 'pond_03' ? 1.8 : selectedPond === 'pond_02' ? 1.5 : 1.2));

  // Active treatment tab
  const [activeTab, setActiveTab] = useState(initialTreatment);

  // Copied state for treatment slip
  const [copied, setCopied] = useState(false);

  // Interactive dosage intensity parameters
  const [saltIntensity, setSaltIntensity] = useState(2.0); // kg/m3 for pond (1.0 to 3.0)
  const [dipTankLiters, setDipTankLiters] = useState(500); // Dip tank volume in liters
  const [dipConcentration, setDipConcentration] = useState(2.5); // % for dip (1.5 to 3.5%)
  const [waterExchangePct, setWaterExchangePct] = useState(25); // % water exchange (15 to 40%)

  // Handle ESC key and background body scroll lock + Lenis smooth scroll pause
  useEffect(() => {
    if (!isOpen) return;

    // Pause Lenis smooth scrolling so mousewheel events stay inside modal
    if (window.__lenis) {
      window.__lenis.stop();
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      // Resume Lenis smooth scroll on modal close
      if (window.__lenis) {
        window.__lenis.start();
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Volume calculations
  const volumeM3 = useMemo(() => {
    if (unitMode === 'meters') {
      return Math.max(1, length * width * depth);
    } else {
      const ft3 = length * width * depth;
      return Math.max(1, ft3 * 0.0283168);
    }
  }, [length, width, depth, unitMode]);

  const volumeLiters = useMemo(() => {
    return volumeM3 * 1000;
  }, [volumeM3]);

  // Surface area in square meters and acres
  const surfaceAreaM2 = useMemo(() => {
    if (unitMode === 'meters') return length * width;
    return (length * width) * 0.092903;
  }, [length, width, unitMode]);

  const surfaceAreaAcres = useMemo(() => {
    return surfaceAreaM2 / 4046.86;
  }, [surfaceAreaM2]);

  // Treatment Calculations
  // 1. Whole Pond Salt (Osmotic Relief / Nitrite Protection)
  const wholePondSaltKg = useMemo(() => {
    return Math.round(volumeM3 * saltIntensity);
  }, [volumeM3, saltIntensity]);

  // 2. Dip Bath Salt (Separate Tank)
  const dipSaltKg = useMemo(() => {
    return ((dipTankLiters * dipConcentration) / 100).toFixed(1);
  }, [dipTankLiters, dipConcentration]);

  // 3. Agricultural Lime (CaCO3) for low pH
  const limeRequiredKg = useMemo(() => {
    const currentPh = telemetry?.ph ?? 7.2;
    if (currentPh >= 7.2) {
      return Math.max(5, Math.round((volumeM3 / 1000) * 10));
    }
    const deficit = Math.max(0.1, 7.4 - currentPh);
    const kgPer1000m3 = (deficit / 0.5) * 25;
    return Math.max(10, Math.round((volumeM3 / 1000) * kgPer1000m3));
  }, [volumeM3, telemetry?.ph]);

  // 4. Fresh Water Exchange
  const waterExchangeLiters = useMemo(() => {
    return Math.round((volumeLiters * waterExchangePct) / 100);
  }, [volumeLiters, waterExchangePct]);

  // 5. Aerator Runtime (Hours) based on current DO
  const aeratorHours = useMemo(() => {
    const doVal = telemetry?.dissolved_oxygen_mg_l ?? 5.5;
    if (doVal < 2.5) return 8.0;
    if (doVal < 4.0) return 6.5;
    if (doVal < 5.0) return 4.5;
    return 3.0;
  }, [telemetry?.dissolved_oxygen_mg_l]);

  // Copy treatment slip to clipboard
  const handleCopySlip = () => {
    const slipText = `=========================================
AQUAGUARD AI - POND TREATMENT DOSAGE SLIP
=========================================
Pond Name: ${currentPondName}
Measurements: ${length} x ${width} x ${depth} ${unitMode === 'meters' ? 'meters' : 'feet'}
Water Volume: ${volumeM3.toFixed(0)} m³ (${volumeLiters.toLocaleString()} Liters)
Surface Area: ${surfaceAreaM2.toFixed(0)} m² (${surfaceAreaAcres.toFixed(2)} acres)

RECOMMENDED NATURAL TREATMENT DOSAGES:
1. Whole Pond Rock Salt: ${wholePondSaltKg} kg (${(wholePondSaltKg / 50).toFixed(1)} standard 50 kg bags)
   -> Broadcast evenly around aerators in the morning.
2. Agricultural Lime (CaCO₃): ${limeRequiredKg} kg (${(limeRequiredKg / 50).toFixed(1)} standard 50 kg bags)
   -> Mix slurry in water bucket, apply evenly across edges.
3. Fresh Water Exchange (${waterExchangePct}%): ${waterExchangeLiters.toLocaleString()} Liters
   -> Drain bottom water while slowly refilling.
4. Aeration Runtime: ${aeratorHours} hours
   -> Run paddlewheels/bubblers from 11:00 PM to sunrise.

Safe Standard: Zero antibiotics. 100% organic mineral recovery.
=========================================`;

    navigator.clipboard.writeText(slipText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}
      data-lenis-prevent="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2, 4, 8, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        overscrollBehavior: 'contain'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
        style={{
          background: 'rgba(12, 16, 24, 0.96)',
          backdropFilter: 'blur(36px) saturate(220%)',
          WebkitBackdropFilter: 'blur(36px) saturate(220%)',
          border: '1px solid rgba(180, 240, 58, 0.35)',
          borderRadius: '24px',
          width: 'min(820px, calc(100vw - 32px))',
          maxHeight: 'min(90vh, 860px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.95), 0 0 36px rgba(180, 240, 58, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
          overflow: 'hidden',
          overscrollBehavior: 'contain'
        }}
      >
        {/* Modal Header (Fixed at top) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.15rem 1.4rem',
          flexShrink: 0,
          background: 'rgba(16, 20, 30, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(180, 240, 58, 0.22) 0%, rgba(132, 204, 22, 0.32) 100%)',
              border: '1px solid rgba(180, 240, 58, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 18px rgba(180, 240, 58, 0.25)',
              flexShrink: 0
            }}>
              <Scale size={22} color="#b4f03a" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.01em', margin: 0 }}>
                  {tr('dosage_calc_title', 'Pond Treatment Dosage Calculator')}
                </h3>
                <span className="status-pill status-normal" style={{ fontSize: '0.675rem', padding: '0.15rem 0.55rem' }}>
                  {currentPondName}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', marginBottom: 0 }}>
                {tr('dosage_calc_sub', 'Accurate physical kilograms, sacks, water flush liters, and aeration runtime for your pond dimensions')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{
              padding: '0.4rem 0.7rem',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer'
            }}
            title={tr('modal_close', 'Close')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
          <div
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            onWheel={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              padding: '1.25rem 1.4rem',
              minHeight: 0
            }}
          >
            {/* Section 1: Pond Dimensions & Water Volume Input */}
            <div style={{
              background: 'rgba(16, 20, 29, 0.55)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '16px',
              padding: '1.1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Waves size={16} color="#b4f03a" />
                  <span style={{ fontSize: '0.825rem', fontWeight: '700', color: '#f1f5f9', letterSpacing: '0.02em' }}>
                    {tr('pond_size_and_volume', 'Pond Size & Water Volume')}
                  </span>
                </div>

                {/* Metric / Feet Toggle */}
                <div style={{
                  display: 'flex',
                  background: 'rgba(10, 14, 20, 0.65)',
                  borderRadius: '8px',
                  padding: '0.15rem',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (unitMode !== 'meters') {
                        setUnitMode('meters');
                        setLength(Math.round(length * 0.3048));
                        setWidth(Math.round(width * 0.3048));
                        setDepth(Number((depth * 0.3048).toFixed(1)));
                      }
                    }}
                    style={{
                      background: unitMode === 'meters' ? '#b4f03a' : 'transparent',
                      color: unitMode === 'meters' ? '#0f172a' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.725rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tr('unit_meters', 'Meters (m)')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (unitMode !== 'feet') {
                        setUnitMode('feet');
                        setLength(Math.round(length * 3.28084));
                        setWidth(Math.round(width * 3.28084));
                        setDepth(Number((depth * 3.28084).toFixed(1)));
                      }
                    }}
                    style={{
                      background: unitMode === 'feet' ? '#b4f03a' : 'transparent',
                      color: unitMode === 'feet' ? '#0f172a' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.725rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tr('unit_feet', 'Feet (ft)')}
                  </button>
                </div>
              </div>

              {/* Three dimension inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                {/* Length */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-dim)', fontWeight: '600' }}>{tr('length_label', 'Length')}</span>
                    <span style={{ fontWeight: '700', color: '#b4f03a', fontFamily: 'var(--font-sans)' }}>
                      {length} {unitMode === 'meters' ? 'm' : 'ft'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={unitMode === 'meters' ? 5 : 15}
                    max={unitMode === 'meters' ? 100 : 330}
                    step={unitMode === 'meters' ? 1 : 5}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#b4f03a' }}
                  />
                </div>

                {/* Width */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-dim)', fontWeight: '600' }}>{tr('width_label', 'Width')}</span>
                    <span style={{ fontWeight: '700', color: '#b4f03a', fontFamily: 'var(--font-sans)' }}>
                      {width} {unitMode === 'meters' ? 'm' : 'ft'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={unitMode === 'meters' ? 3 : 10}
                    max={unitMode === 'meters' ? 60 : 200}
                    step={unitMode === 'meters' ? 1 : 5}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#b4f03a' }}
                  />
                </div>

                {/* Depth */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-dim)', fontWeight: '600' }}>{tr('depth_label', 'Average Water Depth')}</span>
                    <span style={{ fontWeight: '700', color: '#b4f03a', fontFamily: 'var(--font-sans)' }}>
                      {depth} {unitMode === 'meters' ? 'm' : 'ft'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={unitMode === 'meters' ? 0.5 : 2}
                    max={unitMode === 'meters' ? 4.0 : 13}
                    step={unitMode === 'meters' ? 0.1 : 0.5}
                    value={depth}
                    onChange={(e) => setDepth(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#b4f03a' }}
                  />
                </div>
              </div>

              {/* Computed Volume Badge Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.65rem',
                marginTop: '1rem',
                paddingTop: '0.85rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div className="metric-box" style={{ padding: '0.6rem 0.85rem' }}>
                  <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                    {tr('water_volume', 'Total Water Volume')} (m³)
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#b4f03a', marginTop: '0.15rem' }}>
                    {volumeM3.toFixed(0)} m³
                  </div>
                </div>

                <div className="metric-box" style={{ padding: '0.6rem 0.85rem' }}>
                  <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                    {tr('total_water_liters', 'Total Water (Liters)')}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#f8fafc', marginTop: '0.15rem' }}>
                    {volumeLiters.toLocaleString()} L
                  </div>
                </div>

                <div className="metric-box" style={{ padding: '0.6rem 0.85rem' }}>
                  <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                    {tr('pond_surface_area', 'Pond Surface Area')}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#a78bfa', marginTop: '0.15rem' }}>
                    {surfaceAreaM2.toFixed(0)} m² <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontWeight: '500' }}>({surfaceAreaAcres.toFixed(2)} ac)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Treatment Selection Tabs */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                {tr('treatment_types', 'Natural Treatment Types')}
              </div>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('salt_pond')}
                  style={{
                    background: activeTab === 'salt_pond' ? 'rgba(180, 240, 58, 0.22)' : 'rgba(16, 20, 29, 0.5)',
                    color: activeTab === 'salt_pond' ? '#b4f03a' : 'var(--text-muted)',
                    border: activeTab === 'salt_pond' ? '1px solid #b4f03a' : '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '10px',
                    fontSize: '0.775rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sparkles size={14} color="#b4f03a" />
                  <span>{tr('salt_pond_label', 'Whole Pond Rock Salt')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('salt_dip')}
                  style={{
                    background: activeTab === 'salt_dip' ? 'rgba(180, 240, 58, 0.22)' : 'rgba(16, 20, 29, 0.5)',
                    color: activeTab === 'salt_dip' ? '#b4f03a' : 'var(--text-muted)',
                    border: activeTab === 'salt_dip' ? '1px solid #b4f03a' : '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '10px',
                    fontSize: '0.775rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Scale size={14} color="#a78bfa" />
                  <span>{tr('salt_dip_label', 'Intensive Saline Dip Vat')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('lime')}
                  style={{
                    background: activeTab === 'lime' ? 'rgba(180, 240, 58, 0.22)' : 'rgba(16, 20, 29, 0.5)',
                    color: activeTab === 'lime' ? '#b4f03a' : 'var(--text-muted)',
                    border: activeTab === 'lime' ? '1px solid #b4f03a' : '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '10px',
                    fontSize: '0.775rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Layers size={14} color="#f59e0b" />
                  <span>{tr('lime_label', 'Agricultural Lime (CaCO₃)')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('water_exchange')}
                  style={{
                    background: activeTab === 'water_exchange' ? 'rgba(180, 240, 58, 0.22)' : 'rgba(16, 20, 29, 0.5)',
                    color: activeTab === 'water_exchange' ? '#b4f03a' : 'var(--text-muted)',
                    border: activeTab === 'water_exchange' ? '1px solid #b4f03a' : '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '10px',
                    fontSize: '0.775rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Droplet size={14} color="#38bdf8" />
                  <span>{tr('water_exchange_label', 'Clean Water Exchange')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('aeration')}
                  style={{
                    background: activeTab === 'aeration' ? 'rgba(180, 240, 58, 0.22)' : 'rgba(16, 20, 29, 0.5)',
                    color: activeTab === 'aeration' ? '#b4f03a' : 'var(--text-muted)',
                    border: activeTab === 'aeration' ? '1px solid #b4f03a' : '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '10px',
                    fontSize: '0.775rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Wind size={14} color="#b4f03a" />
                  <span>{tr('aeration_label', 'Aeration Runtime Schedule')}</span>
                </button>
              </div>
            </div>

            {/* Section 3: Active Treatment Dosage Calculation Card */}
            <div style={{
              background: 'rgba(16, 20, 29, 0.55)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(180, 240, 58, 0.25)',
              borderRadius: '16px',
              padding: '1.2rem',
              marginBottom: '0.5rem'
            }}>
              {/* TAB 1: WHOLE POND SALT */}
              {activeTab === 'salt_pond' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
                      {tr('salt_pond_heading', 'Natural Non-Iodized Rock Salt (Whole Pond)')}
                    </h4>
                    <span className="status-pill status-normal" style={{ fontSize: '0.7rem' }}>
                      {tr('salt_pond_badge', 'Osmotic Relief & Nitrite Guard')}
                    </span>
                  </div>

                  {/* Slider for intensity */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-dim)', fontWeight: '600' }}>
                        {tr('dosage_rate_label', 'Application Dosage Rate:')}
                      </span>
                      <span style={{ fontWeight: '700', color: '#b4f03a', fontFamily: 'var(--font-sans)' }}>
                        {saltIntensity.toFixed(1)} kg / m³ ({saltIntensity.toFixed(1)} ppt salinity)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={saltIntensity}
                      onChange={(e) => setSaltIntensity(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#b4f03a' }}
                    />
                  </div>

                  {/* Result Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                        {tr('total_needed', 'Total Amount Needed')}
                      </div>
                      <div style={{ fontSize: '1.45rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#b4f03a', marginTop: '0.2rem' }}>
                        {wholePondSaltKg.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>kg</span>
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>({(wholePondSaltKg * 2.20462).toFixed(0)} lbs)</div>
                    </div>

                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                        {tr('bags_count', 'Standard 50 kg Sacks')}
                      </div>
                      <div style={{ fontSize: '1.45rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#f8fafc', marginTop: '0.2rem' }}>
                        {(wholePondSaltKg / 50).toFixed(1)} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>bags</span>
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>{tr('standard_bags_label', 'Standard 50 kg sacks')}</div>
                    </div>

                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                        {tr('estimated_cost', 'Estimated Remedy Cost')}
                      </div>
                      <div style={{ fontSize: '1.45rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#a78bfa', marginTop: '0.2rem' }}>
                        ₹{(wholePondSaltKg * 10).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>~${((wholePondSaltKg * 10) / 85).toFixed(1)} USD (@ ₹10/kg)</div>
                    </div>
                  </div>

                  {/* Farmer Instruction */}
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.45', background: 'rgba(0, 0, 0, 0.25)', padding: '0.75rem 0.95rem', borderRadius: '12px' }}>
                    <strong style={{ color: '#b4f03a' }}>{tr('how_to_apply', 'How to Apply Safely')}:</strong> Dissolve salt in buckets of pond water and distribute evenly around the aerator water flow in the early morning. Helps fish breathe easy by shielding gills from toxic nitrite and bacterial stress.
                  </div>
                </div>
              )}

              {/* TAB 2: INTENSE SALT DIP BATH */}
              {activeTab === 'salt_dip' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
                      {tr('salt_dip_heading', 'Intensive Salt Dip Bath (Separate Quarantine Vat)')}
                    </h4>
                    <span className="status-pill status-warning" style={{ fontSize: '0.7rem' }}>
                      {tr('salt_dip_badge', 'External Parasite & Fungal Stripper')}
                    </span>
                  </div>

                  {/* Tank size & Concentration */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                        <span style={{ color: 'var(--text-dim)', fontWeight: '600' }}>
                          {tr('tank_volume_label', 'Treatment Tub / Tank Volume:')}
                        </span>
                        <span style={{ fontWeight: '700', color: '#b4f03a', fontFamily: 'var(--font-sans)' }}>{dipTankLiters} Liters</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="2000"
                        step="50"
                        value={dipTankLiters}
                        onChange={(e) => setDipTankLiters(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#b4f03a' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                        <span style={{ color: 'var(--text-dim)', fontWeight: '600' }}>
                          {tr('salinity_conc_label', 'Bath Salinity Concentration:')}
                        </span>
                        <span style={{ fontWeight: '700', color: '#a78bfa', fontFamily: 'var(--font-sans)' }}>{dipConcentration}%</span>
                      </div>
                      <input
                        type="range"
                        min="1.5"
                        max="3.5"
                        step="0.1"
                        value={dipConcentration}
                        onChange={(e) => setDipConcentration(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#a78bfa' }}
                      />
                    </div>
                  </div>

                  {/* Result Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                        {tr('total_needed', 'Total Amount Needed')}
                      </div>
                      <div style={{ fontSize: '1.45rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#b4f03a', marginTop: '0.2rem' }}>
                        {dipSaltKg} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>kg</span>
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Rock salt dissolved in vat</div>
                    </div>

                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                        {tr('bath_time_limit', 'Bath Time Limit')}
                      </div>
                      <div style={{ fontSize: '1.45rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#f8fafc', marginTop: '0.2rem' }}>
                        5 - 10 <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>mins</span>
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Never exceed 15 mins</div>
                    </div>

                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                        {tr('aerator_in_tank', 'Aerator in Tank')}
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#38bdf8', marginTop: '0.2rem' }}>
                        REQUIRED
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Use air pump / airstone</div>
                    </div>
                  </div>

                  {/* Farmer Instruction */}
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.45', background: 'rgba(0, 0, 0, 0.25)', padding: '0.75rem 0.95rem', borderRadius: '12px' }}>
                    <strong style={{ color: '#b4f03a' }}>{tr('how_to_apply', 'How to Apply Safely')}:</strong> Net sick fish with white spots or skin sores and place gently in the aerated dip vat for 5 to 10 minutes. If fish rolls on its side, return it immediately to fresh pond water. Destroys skin parasites and fungus without medicating the whole pond!
                  </div>
                </div>
              )}

              {/* TAB 3: AGRICULTURAL LIME (CaCO3) */}
              {activeTab === 'lime' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
                      {tr('lime_heading', 'Agricultural Lime (CaCO₃ / Dolomite)')}
                    </h4>
                    <span className="status-pill status-normal" style={{ fontSize: '0.7rem' }}>
                      Current pH: {telemetry?.ph?.toFixed(2) ?? '7.20'}
                    </span>
                  </div>

                  {/* Result Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                        {tr('total_needed', 'Total Amount Needed')}
                      </div>
                      <div style={{ fontSize: '1.45rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#b4f03a', marginTop: '0.2rem' }}>
                        {limeRequiredKg.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>kg</span>
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Agricultural Limestone (CaCO₃)</div>
                    </div>

                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                        {tr('bags_count', 'Standard 50 kg Sacks')}
                      </div>
                      <div style={{ fontSize: '1.45rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#f8fafc', marginTop: '0.2rem' }}>
                        {(limeRequiredKg / 50).toFixed(1)} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>bags</span>
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>{tr('standard_bags_label', 'Standard 50 kg sacks')}</div>
                    </div>

                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                        {tr('estimated_cost', 'Estimated Remedy Cost')}
                      </div>
                      <div style={{ fontSize: '1.45rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#a78bfa', marginTop: '0.2rem' }}>
                        ₹{(limeRequiredKg * 8).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>~${((limeRequiredKg * 8) / 85).toFixed(1)} USD (@ ₹8/kg)</div>
                    </div>
                  </div>

                  {/* Farmer Instruction */}
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.45', background: 'rgba(0, 0, 0, 0.25)', padding: '0.75rem 0.95rem', borderRadius: '12px' }}>
                    <strong style={{ color: '#b4f03a' }}>{tr('how_to_apply', 'How to Apply Safely')}:</strong> Broadcast dry powdered lime or mix as slurry with water and spread evenly over the pond surface between 9:00 AM and 11:00 AM on a sunny day. Stabilizes water acidity and prevents sudden pH drops during rainstorms.
                  </div>
                </div>
              )}

              {/* TAB 4: FRESH WATER EXCHANGE */}
              {activeTab === 'water_exchange' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
                      {tr('water_exchange_heading', 'Fresh Water Exchange & Bottom Flushing')}
                    </h4>
                    <span className="status-pill status-warning" style={{ fontSize: '0.7rem' }}>
                      {tr('water_exchange_badge', 'Flush Toxic Ammonia Gas')}
                    </span>
                  </div>

                  {/* Slider for exchange percentage */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-dim)', fontWeight: '600' }}>
                        {tr('exchange_prop_label', 'Exchange Proportion:')}
                      </span>
                      <span style={{ fontWeight: '700', color: '#38bdf8', fontFamily: 'var(--font-sans)' }}>{waterExchangePct}% of total volume</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      step="5"
                      value={waterExchangePct}
                      onChange={(e) => setWaterExchangePct(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#38bdf8' }}
                    />
                  </div>

                  {/* Result Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>Flush Volume (Liters)</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#38bdf8', marginTop: '0.2rem' }}>
                        {waterExchangeLiters.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>L</span>
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>({(waterExchangeLiters / 1000).toFixed(0)} m³)</div>
                    </div>

                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>Water Depth Change</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#f8fafc', marginTop: '0.2rem' }}>
                        ~{(depth * (waterExchangePct / 100)).toFixed(2)} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{unitMode === 'meters' ? 'm' : 'ft'}</span>
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Drop and replenish depth</div>
                    </div>

                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>Water Source</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#b4f03a', marginTop: '0.2rem' }}>
                        Well / Tube-Well
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Oxygen-rich clean water</div>
                    </div>
                  </div>

                  {/* Farmer Instruction */}
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.45', background: 'rgba(0, 0, 0, 0.25)', padding: '0.75rem 0.95rem', borderRadius: '12px' }}>
                    <strong style={{ color: '#b4f03a' }}>{tr('how_to_apply', 'How to Apply Safely')}:</strong> Drain water from the pond bottom pipe (where fish feces and decomposed organic waste settle) while slowly pumping fresh water in from the opposite shallow side to prevent sudden temperature shock.
                  </div>
                </div>
              )}

              {/* TAB 5: AERATION RUNTIME */}
              {activeTab === 'aeration' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
                      {tr('aeration_heading', 'Nighttime Aerator Runtime & Paddlewheel Schedule')}
                    </h4>
                    <span className="status-pill status-normal" style={{ fontSize: '0.7rem' }}>
                      Current DO: {telemetry?.dissolved_oxygen_mg_l?.toFixed(1) ?? '5.5'} mg/L
                    </span>
                  </div>

                  {/* Result Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>Nightly Runtime</div>
                      <div style={{ fontSize: '1.45rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#b4f03a', marginTop: '0.2rem' }}>
                        {aeratorHours} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>hours</span>
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Paddlewheels / Air diffusers</div>
                    </div>

                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>Recommended Window</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#f8fafc', marginTop: '0.2rem' }}>
                        11 PM - 6 AM
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Critical pre-dawn period</div>
                    </div>

                    <div className="metric-box" style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>Target Morning DO</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#38bdf8', marginTop: '0.2rem' }}>
                        &gt; 5.0 mg/L
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Safe oxygen for breathing</div>
                    </div>
                  </div>

                  {/* Farmer Instruction */}
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.45', background: 'rgba(0, 0, 0, 0.25)', padding: '0.75rem 0.95rem', borderRadius: '12px' }}>
                    <strong style={{ color: '#b4f03a' }}>{tr('how_to_apply', 'How to Apply Safely')}:</strong> Plankton in ponds consumes oxygen rapidly at night. Start aerators at 11:00 PM and run continuously through 6:00 AM until natural sunlight resumes photosynthesis. Prevents catastrophic morning fish kills!
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Modal Footer & Action Buttons (Fixed at bottom) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '1rem 1.4rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(16, 20, 30, 0.5)',
            flexShrink: 0
          }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Info size={14} color="#b4f03a" />
              <span>Zero antibiotics. 100% compliant with FAO natural aquaculture standards.</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={handleCopySlip}
                className="btn-secondary"
                style={{
                  fontSize: '0.8rem',
                  padding: '0.45rem 0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: copied ? '#b4f03a' : 'inherit',
                  cursor: 'pointer'
                }}
              >
                {copied ? <Check size={14} color="#b4f03a" /> : <Copy size={14} />}
                <span>{copied ? tr('copied_slip', 'Copied to Clipboard!') : tr('copy_slip_btn', 'Copy Treatment Slip')}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="btn-primary"
                style={{
                  fontSize: '0.8rem',
                  padding: '0.45rem 1.25rem',
                  cursor: 'pointer'
                }}
              >
                {tr('modal_close', 'Close')}
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
      );
}

