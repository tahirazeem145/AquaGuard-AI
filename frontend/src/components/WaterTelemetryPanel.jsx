import React, { useMemo } from 'react';
import { Droplet, Thermometer, Wind, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function WaterTelemetryPanel({
  telemetry,
  onChangeTelemetry,
  onEvaluateWater,
  waterEvaluation,
  isEvaluating
}) {
  const { t, translateTier } = useLanguage();

  // Live calculation of toxic un-ionized ammonia (Emerson thermodynamics)
  const nh3 = useMemo(() => {
    const tempK = telemetry.temperature_c + 273.15;
    const pka = 0.09018 + (2729.92 / tempK);
    const fraction = 1.0 / (Math.pow(10, pka - telemetry.ph) + 1.0);
    return (telemetry.total_ammonia_mg_l * fraction);
  }, [telemetry.total_ammonia_mg_l, telemetry.temperature_c, telemetry.ph]);

  const handleChange = (key, val) => {
    onChangeTelemetry({
      ...telemetry,
      [key]: parseFloat(val)
    });
  };

  // Status color helpers using Figma palette (Electric Lime / Amber / Coral)
  const getDoColor = (v) => (v < 2.0 ? '#f43f5e' : v < 5.0 ? '#f59e0b' : '#b4f03a');
  const getPhColor = (v) => (v < 6.5 || v > 8.5 ? '#f59e0b' : '#b4f03a');
  const getTempColor = (v) => (v < 20.0 || v > 32.0 ? '#f59e0b' : '#b4f03a');
  const getNh3Color = (v) => (v > 0.08 ? '#f43f5e' : v > 0.03 ? '#f59e0b' : '#b4f03a');

  const hazardScore = waterEvaluation?.hazard_score ?? 0;
  const waterStatus = waterEvaluation?.status ?? 'NORMAL';

  return (
    <div className="card-panel">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}>
            {t('water_readings_title')}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {t('water_readings_sub')}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`status-pill status-${waterStatus.toLowerCase()}`}>
            {translateTier(waterStatus, true)}
          </span>
        </div>
      </div>

      {/* Sensor Input Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

        {/* Dissolved Oxygen */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#e2e8f0', fontWeight: '500' }}>
              <Wind size={13} color="#b4f03a" />
              {t('oxygen_label')}
            </span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: '700', color: getDoColor(telemetry.dissolved_oxygen_mg_l) }}>
              {telemetry.dissolved_oxygen_mg_l.toFixed(1)} mg/L <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>{t('oxygen_safe')}</span>
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="12.0"
            step="0.1"
            value={telemetry.dissolved_oxygen_mg_l}
            onChange={(e) => handleChange('dissolved_oxygen_mg_l', e.target.value)}
          />
        </div>

        {/* Water pH */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#e2e8f0', fontWeight: '500' }}>
              <Droplet size={13} color="#a78bfa" />
              {t('ph_label')}
            </span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: '700', color: getPhColor(telemetry.ph) }}>
              {telemetry.ph.toFixed(2)} pH <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>{t('ph_safe')}</span>
            </span>
          </div>
          <input
            type="range"
            min="5.0"
            max="10.5"
            step="0.05"
            value={telemetry.ph}
            onChange={(e) => handleChange('ph', e.target.value)}
          />
        </div>

        {/* Temperature */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#e2e8f0', fontWeight: '500' }}>
              <Thermometer size={13} color="#f59e0b" />
              {t('temp_label')}
            </span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: '700', color: getTempColor(telemetry.temperature_c) }}>
              {telemetry.temperature_c.toFixed(1)} °C <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>{t('temp_best')}</span>
            </span>
          </div>
          <input
            type="range"
            min="15.0"
            max="38.0"
            step="0.2"
            value={telemetry.temperature_c}
            onChange={(e) => handleChange('temperature_c', e.target.value)}
          />
        </div>

        {/* Total Ammonia Nitrogen (TAN) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#e2e8f0', fontWeight: '500' }}>
              <Activity size={13} color="#b4f03a" />
              {t('ammonia_label')}
            </span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: '700', color: '#f1f5f9' }}>
              {telemetry.total_ammonia_mg_l.toFixed(2)} mg/L <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>{t('ammonia_safe')}</span>
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="5.0"
            step="0.05"
            value={telemetry.total_ammonia_mg_l}
            onChange={(e) => handleChange('total_ammonia_mg_l', e.target.value)}
          />
        </div>

        {/* Calculated Toxic Un-Ionized Ammonia Frosted Glass Box */}
        <div style={{
          background: 'rgba(20, 23, 31, 0.65)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '600' }}>
              {t('poison_ammonia_title')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
              {t('poison_ammonia_sub')} ({telemetry.temperature_c.toFixed(1)}°C, pH {telemetry.ph.toFixed(2)})
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: '800',
              fontFamily: 'var(--font-sans)',
              color: getNh3Color(nh3)
            }}>
              {nh3.toFixed(4)} <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>mg/L</span>
            </div>
            <span style={{
              fontSize: '0.675rem',
              color: getNh3Color(nh3),
              fontWeight: '700',
              textTransform: 'uppercase'
            }}>
              {nh3 > 0.08 ? t('lethal_danger') : nh3 > 0.03 ? t('high_stress') : t('safe_level')}
            </span>
          </div>
        </div>

      </div>

      {/* Water Hazard Score and Action */}
      <div style={{
        marginTop: '1rem',
        paddingTop: '0.85rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{t('water_danger_score')} </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: '800', color: '#b4f03a' }}>
            {hazardScore.toFixed(1)} / 100
          </span>
        </div>

        <button
          onClick={onEvaluateWater}
          disabled={isEvaluating}
          className="btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
        >
          {isEvaluating ? t('checking') : t('check_water_now')}
        </button>
      </div>

    </div>
  );
}
