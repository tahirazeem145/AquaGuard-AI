import React, { useState, useRef, useEffect } from 'react';
import { Waves, CheckCircle2, Activity, History, ChevronDown, Check, Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Header({
  backendStatus,
  selectedPond,
  onSelectPond,
  ponds,
  currentView = 'diagnostics',
  onChangeView,
  historyCount = 0
}) {
  const { language, setLanguage, t, languages } = useLanguage();
  const isOnline = backendStatus?.status === 'healthy';
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  // Close dropdowns on click outside or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setIsLangOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentPondObj = ponds.find(p => (p.id || p.pond_id) === selectedPond) || ponds[0] || { name: 'Nursery Pond Alpha (Tilapia)' };
  const currentPondName = currentPondObj.name || 'Nursery Pond Alpha (Tilapia)';
  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
        <header
          className="card-panel"
          style={{
            padding: '0.85rem 1.25rem',
            marginBottom: '1.25rem',
            position: 'relative',
            zIndex: 100
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.85rem 1.25rem'
          }}>

            {/* Brand identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(180, 240, 58, 0.18) 0%, rgba(132, 204, 22, 0.28) 100%)',
                  border: '1px solid rgba(180, 240, 58, 0.35)',
                  boxShadow: '0 0 16px rgba(180, 240, 58, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
            justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Waves size={24} color="#b4f03a" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#f8fafc' }}>
                      AquaGuard <span style={{ color: '#b4f03a' }}>AI</span>
                    </h1>
                    <span className="status-pill status-normal" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                      v1.0
                    </span>
                  </div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      maxWidth: '380px',
                      lineHeight: '1.3'
                    }}>
                      {t('brand_sub')}
                    </p>
                </div>
              </div>

              {/* View Switcher Navigation Tabs */}
              {onChangeView && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(14, 18, 26, 0.45)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  padding: '0.3rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                  flexShrink: 0
                }}>
                  <button
                    onClick={() => onChangeView('diagnostics')}
                    style={{
                      background: currentView === 'diagnostics' ? '#b4f03a' : 'transparent',
                      color: currentView === 'diagnostics' ? '#0f172a' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.45rem 0.95rem',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: currentView === 'diagnostics' ? '0 4px 14px rgba(180, 240, 58, 0.4)' : 'none',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <Activity size={14} />
                    <span>{t('tab_live_check')}</span>
                  </button>

                  <button
                    onClick={() => onChangeView('ledger')}
                    style={{
                      background: currentView === 'ledger' ? '#b4f03a' : 'transparent',
                      color: currentView === 'ledger' ? '#0f172a' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.45rem 0.95rem',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: currentView === 'ledger' ? '0 4px 14px rgba(180, 240, 58, 0.4)' : 'none',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <History size={14} />
                    <span>{t('tab_past_records')}</span>
                    {historyCount > 0 && (
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '999px',
                        background: currentView === 'ledger' ? 'rgba(0,0,0,0.25)' : 'rgba(180, 240, 58, 0.18)',
                        color: currentView === 'ledger' ? '#0f172a' : '#b4f03a',
                        fontWeight: '800',
                        fontFamily: 'var(--font-sans)'
                      }}>
                        {historyCount}
                      </span>
                    )}
                  </button>
                </div>
              )}

                {/* Controls: Language Selector + Pond Selector + Status */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  flexWrap: 'wrap'
                }}>

                        {/* Indian Language Selector Dropdown */ }
                        <div ref={langDropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={() => {
                              setIsLangOpen(!isLangOpen);
                              setIsOpen(false);
                            }}
                            style={{
                              background: 'rgba(16, 20, 29, 0.45)',
                              backdropFilter: 'blur(14px)',
                              WebkitBackdropFilter: 'blur(14px)',
                              border: isLangOpen ? '1px solid #b4f03a' : '1px solid rgba(255, 255, 255, 0.12)',
                              color: 'var(--text-main)',
                              padding: '0.45rem 0.75rem',
                              borderRadius: '10px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              outline: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              boxShadow: isLangOpen ? '0 0 16px rgba(180, 240, 58, 0.25)' : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                              transition: 'all 0.2s ease'
                            }}
                            title="Select your preferred Indian language"
                          >
                            <Globe size={14} color="#b4f03a" />
                            <span style={{ fontWeight: '700' }}>{currentLang.nativeName}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', opacity: 0.85 }}>({currentLang.name})</span>
                            <ChevronDown
                              size={13}
                              color={isLangOpen ? '#b4f03a' : 'var(--text-muted)'}
                              style={{
                                transform: isLangOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease'
                              }}
                            />
                          </button>

                          {/* Language Selection List Dropdown (Anchored with left: 0 to eliminate viewport clipping) */}
                          {isLangOpen && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 6px)',
                                left: 0,
                                minWidth: '270px',
                                maxWidth: 'min(320px, calc(100vw - 32px))',
                                maxHeight: '320px',
                                overflowY: 'auto',
                                background: 'rgba(12, 16, 24, 0.96)',
                                backdropFilter: 'blur(32px) saturate(210%)',
                                WebkitBackdropFilter: 'blur(32px) saturate(210%)',
                                border: '1px solid rgba(180, 240, 58, 0.3)',
                                borderRadius: '14px',
                                padding: '0.45rem',
                                boxShadow: '0 24px 56px -10px rgba(0, 0, 0, 0.95), 0 0 20px rgba(180, 240, 58, 0.15)',
                                zIndex: 1000,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.2rem'
                              }}
                            >
                              <div style={{
                                padding: '0.45rem 0.75rem',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                color: '#b4f03a',
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                                marginBottom: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                          gap: '0.4rem'
                                        }}>
                                        <Globe size={13} color="#b4f03a" />
                                        <span>{t('select_language')} • Indian Languages</span>
                                      </div>
                {
                                      languages.map((l) => {
                                        const isSelected = l.code === language;
                                        return (
                                          <button
                                            key={l.code}
                                            type="button"
                                            onClick={() => {
                                              setLanguage(l.code);
                                              setIsLangOpen(false);
                                            }}
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'space-between',
                                              padding: '0.5rem 0.75rem',
                                              borderRadius: '8px',
                                              background: isSelected ? 'rgba(180, 240, 58, 0.16)' : 'transparent',
                                              color: isSelected ? '#b4f03a' : '#f8fafc',
                                              border: isSelected ? '1px solid rgba(180, 240, 58, 0.3)' : '1px solid transparent',
                                              cursor: 'pointer',
                                              fontSize: '0.8rem',
                                              textAlign: 'left',
                                              transition: 'all 0.15s ease',
                                              width: '100%'
                                            }}
                                            onMouseEnter={(e) => {
                                              if (!isSelected) {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                                                e.currentTarget.style.color = '#ffffff';
                                              }
                                            }}
                                            onMouseLeave={(e) => {
                                              if (!isSelected) {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = '#f8fafc';
                                              }
                                            }}
                                          >
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                              <span style={{ fontSize: '0.825rem', fontWeight: isSelected ? '700' : '600' }}>
                                                {l.nativeName} <span style={{ fontSize: '0.725rem', color: isSelected ? '#b4f03a' : 'var(--text-muted)', fontWeight: '500' }}>({l.name})</span>
                                              </span>
                                              <span style={{ fontSize: '0.675rem', color: isSelected ? 'rgba(180, 240, 58, 0.8)' : 'var(--text-dim)', marginTop: '1px' }}>
                                                {l.region}
                                              </span>
                                            </div>
                                            {isSelected && (
                                              <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                background: 'rgba(180, 240, 58, 0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                  justifyContent: 'center',
                                                  flexShrink: 0
                        }}>
                                                  <Check size={12} color="#b4f03a" strokeWidth={3} />
                                                </div>
                              )}
                            </button>
                          );
                })}
                        </div>
            )}
                  </div>

                    {/* Choose Pond Selector (Custom Glassmorphic Dropdown) */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-dim)',
                          fontWeight: '600',
                          whiteSpace: 'nowrap'
                        }}
                        title="Select which pond to test or view records for"
                      >
                        {t('choose_pond')}
                      </span>

                      <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(!isOpen);
                            setIsLangOpen(false);
                          }}
                          style={{
                            background: 'rgba(16, 20, 29, 0.45)',
                            backdropFilter: 'blur(14px)',
                            WebkitBackdropFilter: 'blur(14px)',
                            border: isOpen ? '1px solid #b4f03a' : '1px solid rgba(255, 255, 255, 0.12)',
                            color: 'var(--text-main)',
                            padding: '0.45rem 0.85rem',
                            borderRadius: '10px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            outline: 'none',
                            cursor: 'pointer',
                            minWidth: '190px',
                            maxWidth: '250px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.5rem',
                            boxShadow: isOpen ? '0 0 16px rgba(180, 240, 58, 0.25)' : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {currentPondName}
                          </span>
                          <ChevronDown
                            size={14}
                            color={isOpen ? '#b4f03a' : 'var(--text-muted)'}
                            style={{
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease',
                              flexShrink: 0
                            }}
                          />
                        </button>

                        {/* Custom Frosted Glass Dropdown Menu */}
                        {isOpen && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 6px)',
                              left: 0,
                              minWidth: '240px',
                              maxWidth: 'min(300px, calc(100vw - 32px))',
                              background: 'rgba(12, 16, 24, 0.96)',
                              backdropFilter: 'blur(32px) saturate(210%)',
                              WebkitBackdropFilter: 'blur(32px) saturate(210%)',
                              border: '1px solid rgba(180, 240, 58, 0.3)',
                              borderRadius: '14px',
                              padding: '0.45rem',
                              boxShadow: '0 24px 56px -10px rgba(0, 0, 0, 0.95), 0 0 20px rgba(180, 240, 58, 0.15)',
                              zIndex: 1000,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.25rem'
                            }}
                          >
                            {ponds.map((p) => {
                              const pid = p.id || p.pond_id;
                              const isSelected = pid === selectedPond;
                              return (
                                <button
                                  key={pid}
                                  type="button"
                                  onClick={() => {
                                    onSelectPond(pid);
                                    setIsOpen(false);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.55rem 0.75rem',
                                    borderRadius: '8px',
                                    background: isSelected ? 'rgba(180, 240, 58, 0.16)' : 'transparent',
                                    color: isSelected ? '#b4f03a' : '#f8fafc',
                                    border: isSelected ? '1px solid rgba(180, 240, 58, 0.3)' : '1px solid transparent',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: isSelected ? '700' : '500',
                                    textAlign: 'left',
                                    transition: 'all 0.15s ease',
                                    width: '100%'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                                      e.currentTarget.style.color = '#ffffff';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.background = 'transparent';
                                      e.currentTarget.style.color = '#f8fafc';
                                    }
                                  }}
                                >
                                  <span>{p.name}</span>
                                  {isSelected && (
                                    <div style={{
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '50%',
                                      background: 'rgba(180, 240, 58, 0.2)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0
                                    }}>
                                      <Check size={12} color="#b4f03a" strokeWidth={3} />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Backend Status indicator */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.45rem 0.75rem',
                      background: isOnline ? 'rgba(180, 240, 58, 0.10)' : 'rgba(244, 63, 94, 0.10)',
                      border: isOnline ? '1px solid rgba(180, 240, 58, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-sans)',
                      boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
                      flexShrink: 0
                    }}>
                      <span style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: isOnline ? '#b4f03a' : '#f43f5e',
                        boxShadow: isOnline ? '0 0 8px #b4f03a' : '0 0 8px #f43f5e',
                        display: 'inline-block',
                        flexShrink: 0
                      }} />
                      <span style={{ color: isOnline ? '#b4f03a' : '#f43f5e', fontWeight: '700' }}>
                        {isOnline ? t('system_online') : t('system_connecting')}
                      </span>
                    </div>

                  </div>

                </div>
              </header>
              );
}
