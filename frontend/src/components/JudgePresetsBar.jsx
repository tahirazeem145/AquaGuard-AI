import React from 'react';
import { Play, Sparkles, AlertOctagon, CheckCircle2, Flame } from 'lucide-react';
import { JUDGE_PRESETS } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

export default function JudgePresetsBar({ activePresetId, onApplyPreset, isAssessing }) {
    const { t, translateTier } = useLanguage();

    const getPresetTitle = (preset) => {
      if (preset.id === 'optimal') return t('preset_1_title').split(':')[0];
      if (preset.id === 'columnaris') return t('preset_2_title').split(':')[0];
      if (preset.id === 'hypoxia_emergency') return t('preset_3_title').split(':')[0];
      return preset.title.split(':')[0];
    };

    const getPresetDesc = (preset) => {
      if (preset.id === 'optimal') return t('preset_1_desc');
      if (preset.id === 'columnaris') return t('preset_2_desc');
      if (preset.id === 'hypoxia_emergency') return t('preset_3_desc');
      return preset.description;
    };

    return (
      <div
        className="card-panel"
        style={{
          padding: '0.85rem 1.25rem',
          marginBottom: '1.25rem',
          position: 'relative',
          zIndex: 10,
          background: 'radial-gradient(circle at 5% 50%, rgba(139, 92, 246, 0.12) 0%, transparent 40%), var(--bg-glass-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="#b4f03a" />
            <span style={{ fontSize: '0.825rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#f1f5f9' }}>
              {t('quick_tests')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            {JUDGE_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              let icon = <CheckCircle2 size={14} color="#b4f03a" />;
              let borderHover = '#b4f03a';

              if (preset.badge === 'WARNING') {
                icon = <Flame size={14} color="#f97316" />;
                borderHover = '#f97316';
              } else if (preset.badge === 'EMERGENCY') {
                icon = <AlertOctagon size={14} color="#f43f5e" />;
                borderHover = '#f43f5e';
              }

              return (
                <button
                  key={preset.id}
                  onClick={() => onApplyPreset(preset)}
                  disabled={isAssessing}
                  className={`btn-preset ${isActive ? 'active' : ''}`}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderColor: isActive ? borderHover : undefined,
                    boxShadow: isActive ? `0 0 16px ${borderHover}40` : 'none'
                  }}
                  title={getPresetDesc(preset)}
                >
                  {icon}
                  <span style={{ fontWeight: '600' }}>{getPresetTitle(preset)}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    opacity: 0.9,
                    padding: '0.1rem 0.4rem',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.08)'
                  }}>
                    {translateTier(preset.badge, true)}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    );
  }
