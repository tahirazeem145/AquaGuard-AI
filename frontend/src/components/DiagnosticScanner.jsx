import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Eye, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

// Plain English translations for fish diseases
export const formatDiseaseName = (condition) => {
  if (!condition) return 'Healthy Fish';
  const c = condition.toLowerCase();
  if (c.includes('healthy')) return 'Healthy Fish (No signs of illness)';
  if (c.includes('gill')) return 'Gill Disease (Swollen, Pale Gills)';
  if (c.includes('red') || c.includes('ulcer') || c.includes('eus')) return 'Red Spot Disease (Body Sores)';
  if (c.includes('dropsy') || c.includes('aero')) return 'Dropsy (Swollen Belly & Raised Scales)';
  if (c.includes('sapro') || c.includes('fungal')) return 'Fungal Infection (Cotton-like Spots)';
  if (c.includes('parasit') || c.includes('ich') || c.includes('white spot')) return 'Parasites (White Spot Disease)';
  if (c.includes('tail') || c.includes('fin') || c.includes('viral')) return 'Fin & Tail Rot (Frayed White Tail)';
  return condition;
};

// Plain English translations for physical symptoms
export const formatSymptom = (text) => {
  if (!text) return text;
  const t = text.toLowerCase();
  if (t.includes('unblemished') || t.includes('reflective silver')) return 'Clear, clean scales and healthy skin';
  if (t.includes('intact fin') || t.includes('inter-radial')) return 'Healthy, smooth fins with no tears or fraying';
  if (t.includes('ocular clarity') || t.includes('edema')) return 'Clear, bright eyes with no cloudiness or swelling';
  if (t.includes('excavated') || t.includes('erythematous') || t.includes('ulcers')) return 'Open red sores and ulcers on the fish body';
  if (t.includes('hemorrhagic') || t.includes('petechiae')) return 'Red bleeding spots along the belly and sides';
  if (t.includes('epizootic') || t.includes('dermal erosion')) return 'Skin tissue breakdown caused by severe infection';
  if (t.includes('distension') || t.includes('dropsy')) return 'Swollen belly filled with fluid (Dropsy)';
  if (t.includes('pinecone') || t.includes('eclasia')) return 'Pinecone-like raised scales sticking out from body';
  if (t.includes('pop-eye') || t.includes('exophthalmos')) return 'Bulging eyes and inflamed vent';
  if (t.includes('gill filament') || t.includes('saddleback')) return 'Brownish damaged spots around gills and upper back';
  if (t.includes('lamellar fusion') || t.includes('oxygen transfer')) return 'Swollen, pale gills that make it difficult for fish to breathe';
  if (t.includes('columnaris') || t.includes('operculum')) return 'Erosion and sores around the mouth and gill covers';
  if (t.includes('cotton-wool') || t.includes('mycelial')) return 'Cotton-like fuzzy white growths on head and skin';
  if (t.includes('filamentous hyphae') || t.includes('water mold')) return 'Fungus spreading over skin scrapes and scratches';
  if (t.includes('nodules') || t.includes('milky-white')) return 'Tiny white dots and bumps across the skin (White Spot)';
  if (t.includes('clamped') || t.includes('ichthyophthiriasis')) return 'Clamped fins held tight against the body';
  if (t.includes('whitish discoloration') || t.includes('caudal peduncle')) return 'Pale white patches spreading toward the tail fin';
  if (t.includes('frayed') || t.includes('jagged fin')) return 'Frayed, ragged tail fin making swimming difficult';
  return text;
};

export default function DiagnosticScanner({
  onImageSelected,
  visualAnalysis,
  isAnalyzing,
  currentImagePreview,
  activeHint
}) {
  const { t, translateDisease } = useLanguage();
  const [claheEnabled, setClaheEnabled] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageSelected(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  };

  const quality = visualAnalysis?.image_quality;
  const primaryCondition = visualAnalysis?.primary_condition ?? 'Healthy Fish';
  const confidence = visualAnalysis?.confidence_score ? (visualAnalysis.confidence_score * 100).toFixed(1) : '95.4';
  const differentials = visualAnalysis?.top_3_differential ?? [
    { condition: 'Healthy Fish', probability: 0.954 },
    { condition: 'Parasitic diseases', probability: 0.032 },
    { condition: 'Bacterial gill disease', probability: 0.014 }
  ];
  const symptoms = visualAnalysis?.symptoms_identified ?? [
    'Clear, unblemished epidermis with continuous reflective silver/bronze scales',
    'Smooth, intact fin margins with transparent inter-radial membranes'
  ];

  return (
    <div className="card-panel">
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}>
            {t('photo_scanner_title')}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {t('photo_scanner_sub')}
          </p>
        </div>

        {/* Clear Photo Mode Toggle */}
        <button
          onClick={() => setClaheEnabled(!claheEnabled)}
          className="btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
          title="Enhances photo lighting and clarity to see skin spots clearly"
        >
          <Eye size={13} color={claheEnabled ? '#b4f03a' : 'var(--text-dim)'} />
          <span>{t('clear_photo_mode')}: {claheEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Upload Drop Zone / Image Preview (Frosted Glass Container) */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? '#b4f03a' : 'rgba(255, 255, 255, 0.16)'}`,
          borderRadius: '16px',
          background: dragActive ? 'rgba(180, 240, 58, 0.12)' : 'rgba(12, 16, 24, 0.38)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: currentImagePreview ? '0.5rem' : '1.75rem',
          textAlign: 'center',
          cursor: 'pointer',
          position: 'relative',
          minHeight: '180px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
          transition: 'all 0.25s ease'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {currentImagePreview ? (
          <div style={{ position: 'relative', width: '100%', maxHeight: '220px', overflow: 'hidden', borderRadius: '10px' }}>
            <img
              src={currentImagePreview}
              alt="Fish Telemetry Preview"
              style={{
                width: '100%',
                maxHeight: '220px',
                objectFit: 'contain',
                filter: claheEnabled ? 'contrast(1.25) saturate(1.15) brightness(1.05)' : 'none',
                transition: 'filter 0.3s ease'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              background: 'rgba(18, 20, 26, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(180, 240, 58, 0.3)',
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
              fontSize: '0.7rem',
              color: '#b4f03a',
              fontWeight: '700',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
            }}>
              {claheEnabled ? t('enhanced_clarity') : t('normal_photo')}
            </div>
          </div>
        ) : (
          <div>
            <UploadCloud size={38} color="#b4f03a" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f1f5f9' }}>
              {t('dropzone_prompt')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {t('dropzone_hint')}
            </div>
          </div>
        )}
      </div>

      {/* Image Quality Checks */}
      {quality && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.55rem',
          marginTop: '0.75rem',
          fontSize: '0.725rem'
        }}>
          <div className="metric-box" style={{ padding: '0.45rem 0.65rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>{t('sharpness')}: </span>
            <span style={{ fontWeight: '700', color: quality.blur_score > 60 ? '#b4f03a' : '#f59e0b' }}>
              {quality.blur_score}
            </span>
          </div>
          <div className="metric-box" style={{ padding: '0.45rem 0.65rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>{t('brightness')}: </span>
            <span style={{ fontWeight: '700', color: '#f1f5f9' }}>
              {quality.brightness_score}
            </span>
          </div>
          <div className="metric-box" style={{ padding: '0.45rem 0.65rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>{t('photo_size')}: </span>
            <span style={{ fontWeight: '700', color: '#f1f5f9' }}>
              {quality.resolution}
            </span>
          </div>
        </div>
      )}

      {/* Diagnostic Results Card (Frosted Glass Panel) */}
      <div style={{
        marginTop: '1rem',
        background: 'rgba(12, 16, 24, 0.38)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        borderRadius: '16px',
        padding: '0.85rem 1rem',
        boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.10)'
      }}>

        {/* Primary Diagnosis */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              {t('main_finding')}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: primaryCondition.includes('Healthy') ? '#b4f03a' : '#f97316' }}>
              {translateDisease(primaryCondition)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              {t('certainty')}
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#b4f03a' }}>
              {confidence}%
            </div>
          </div>
        </div>

        {/* Top-3 Differential Diagnosis Bars */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: '600' }}>
            {t('other_conditions')}
          </div>
          {differentials.map((item, idx) => {
            const pct = (item.probability * 100).toFixed(1);
            return (
              <div key={idx} style={{ marginBottom: '0.45rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{translateDisease(item.condition)}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>{pct}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: idx === 0 ? 'linear-gradient(90deg, #8b5cf6, #b4f03a)' : 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '3px',
                      transition: 'width 0.6s ease'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pathological Symptoms */}
        <div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '600' }}>
            {t('signs_spotted')}
          </div>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {symptoms.map((s, idx) => (
              <li key={idx} style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <span style={{ color: '#b4f03a', marginTop: '1px' }}>•</span>
                <span>{formatSymptom(s)}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
