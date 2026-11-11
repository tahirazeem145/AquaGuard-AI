import React, { useState } from 'react';
import { ShieldCheck, LifeBuoy, Droplet, Sparkles, AlertTriangle, Layers, Scale, Calculator, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import TreatmentDosageCalculatorModal from './TreatmentDosageCalculatorModal';

  export default function ActionPlanCard({
    prescriptivePlan,
    selectedPond = 'pond_01',
    currentPondName = 'Nursery Pond Alpha (Tilapia)',
    telemetry
  }) {
    const { t, translateCategory } = useLanguage();
    const [isCalcOpen, setIsCalcOpen] = useState(false);
    const [calcInitialTab, setCalcInitialTab] = useState('salt_pond');

    const planItems = prescriptivePlan ?? [
      {
        priority: 1,
        category: 'Preventative Maintenance',
        title: 'Daily Water Check & Good Habits',
        instruction: 'Fish and water are in good condition. Continue checking oxygen levels in the morning and evening, and keep pond water clean.',
        dosage_or_metric: 'Check oxygen & pH 2x daily'
      }
    ];

    const getCategoryIcon = (cat) => {
      switch (cat) {
        case 'Emergency Life Support':
          return <LifeBuoy size={16} color="#f43f5e" />;
        case 'Water Remediation':
          return <Droplet size={16} color="#b4f03a" />;
        case 'Alkalinity Buffer':
          return <Layers size={16} color="#f59e0b" />;
        case 'Therapeutic Saline Bath':
        case 'Anti-Fungal Bath':
        case 'Osmotic Relief':
          return <Sparkles size={16} color="#a78bfa" />;
        default:
          return <ShieldCheck size={16} color="#b4f03a" />;
      }
    };

    const getBorderColor = (cat) => {
      switch (cat) {
        case 'Emergency Life Support':
          return '4px solid #f43f5e';
        case 'Alkalinity Buffer':
          return '4px solid #f59e0b';
        case 'Therapeutic Saline Bath':
        case 'Anti-Fungal Bath':
        case 'Osmotic Relief':
          return '4px solid #a78bfa';
        default:
          return '4px solid #b4f03a';
      }
    };

    const mapCategoryToTab = (cat) => {
      switch (cat) {
        case 'Alkalinity Buffer':
          return 'lime';
        case 'Water Remediation':
          return 'water_exchange';
        case 'Emergency Life Support':
          return 'aeration';
        case 'Anti-Fungal Bath':
          return 'salt_dip';
        case 'Therapeutic Saline Bath':
        case 'Osmotic Relief':
        default:
          return 'salt_pond';
      }
    };

    const handleOpenCalculator = (tab = 'salt_pond') => {
      setCalcInitialTab(tab);
      setIsCalcOpen(true);
    };

    return (
      <div className="card-panel">

        {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}>
                {t('care_plan_title')}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {t('care_plan_sub')}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => handleOpenCalculator('salt_pond')}
                className="btn-secondary"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(180, 240, 58, 0.12)',
                  border: '1px solid rgba(180, 240, 58, 0.35)',
                  color: '#b4f03a',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
                title="Calculate exact kilograms of salt, lime, and water exchange for your pond dimensions"
              >
                <Scale size={13} color="#b4f03a" />
                <span>{t('dosage_calc_btn')}</span>
              </button>

              <span className="status-pill status-normal" style={{ fontSize: '0.7rem' }}>
                {planItems.length} {t('steps_to_take')}
              </span>
            </div>
          </div>

          {/* Plan Items List (Frosted Glass Sub-Cards) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {planItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(12, 16, 24, 0.38)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  borderLeft: getBorderColor(item.category),
                  borderRadius: '16px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.10)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      background: 'rgba(180, 240, 58, 0.15)',
                      border: '1px solid rgba(180, 240, 58, 0.3)',
                      color: '#b4f03a',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-sans)'
                    }}>
                      {t('step')} {item.priority}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {translateCategory(item.category)}
                    </span>
                  </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        color: '#b4f03a',
                        fontWeight: '600',
                        fontFamily: 'var(--font-sans)'
                      }}>
                        {item.dosage_or_metric}
                      </div>

                      <button
                        onClick={() => handleOpenCalculator(mapCategoryToTab(item.category))}
                        className="btn-secondary"
                        style={{
                          fontSize: '0.675rem',
                          padding: '0.18rem 0.45rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: '#b4f03a',
                          borderColor: 'rgba(180, 240, 58, 0.3)',
                          cursor: 'pointer'
                        }}
                        title="Open Dosage Calculator for this specific treatment"
                      >
                        <Scale size={11} color="#b4f03a" />
                        <span>{t('calculate_dosage')}</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f8fafc', marginTop: '0.15rem' }}>
                    {item.title}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.45' }}>
                    {item.instruction}
                  </p>
                </div>
        ))}
              </div>

      {/* AMR Stewardship Disclaimer */ }
          <div style={{
            marginTop: '1rem',
            padding: '0.65rem 0.85rem',
            background: 'rgba(180, 240, 58, 0.04)',
            border: '1px dashed rgba(180, 240, 58, 0.25)',
            borderRadius: '10px',
            fontSize: '0.725rem',
            color: '#94a3b8',
            lineHeight: '1.4'
          }}>
            {t('safe_farming_note')}
          </div>

        {/* Interactive Treatment Dosage Calculator Modal */}
        <TreatmentDosageCalculatorModal
          isOpen={isCalcOpen}
          onClose={() => setIsCalcOpen(false)}
          currentPondName={currentPondName}
          selectedPond={selectedPond}
          telemetry={telemetry}
          initialTreatment={calcInitialTab}
        />

      </div>
    );
  }
