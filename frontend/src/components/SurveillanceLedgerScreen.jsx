import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  History,
  ArrowLeft,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Calendar,
  Layers,
  Activity,
  FileSpreadsheet,
  Trash2,
  ExternalLink,
  ChevronRight,
  Eye,
  ShieldAlert,
  ChevronDown,
  Check
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function SurveillanceLedgerScreen({
  history,
  onBackToDiagnostics,
  onLoadHistoricScan,
  onClearHistory,
  ponds
}) {
  const { t, translateDisease, translateTier } = useLanguage();
  const [selectedPondFilter, setSelectedPondFilter] = useState('ALL');
  const [selectedTierFilter, setSelectedTierFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordForModal, setSelectedRecordForModal] = useState(null);

  const [isPondMenuOpen, setIsPondMenuOpen] = useState(false);
  const [isTierMenuOpen, setIsTierMenuOpen] = useState(false);
  const pondMenuRef = useRef(null);
  const tierMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pondMenuRef.current && !pondMenuRef.current.contains(event.target)) {
        setIsPondMenuOpen(false);
      }
      if (tierMenuRef.current && !tierMenuRef.current.contains(event.target)) {
        setIsTierMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute KPI Stats
  const stats = useMemo(() => {
    const total = history.length;
    if (total === 0) return { total: 0, avgScore: '0.0', emergencyCount: 0, normalRatio: '100' };
    const avgScore = history.reduce((sum, r) => sum + (r.risk_score || 0), 0) / total;
    const emergencyCount = history.filter(r => r.severity_tier === 'EMERGENCY' || r.severity_tier === 'WARNING').length;
    const normalCount = history.filter(r => r.severity_tier === 'NORMAL').length;
    const normalRatio = (normalCount / total) * 100;
    return {
      total,
      avgScore: avgScore.toFixed(1),
      emergencyCount,
      normalRatio: normalRatio.toFixed(0)
    };
  }, [history]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return history.filter(record => {
      // Pond filter
      if (selectedPondFilter !== 'ALL' && record.pond_id !== selectedPondFilter) {
        return false;
      }
      // Tier filter
      if (selectedTierFilter !== 'ALL' && record.severity_tier !== selectedTierFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const condMatch = (record.primary_condition || '').toLowerCase().includes(q);
        const pondMatch = (record.pond_id || '').toLowerCase().includes(q);
        const idMatch = (record.assessment_id || '').toLowerCase().includes(q);
        return condMatch || pondMatch || idMatch;
      }
      return true;
    });
  }, [history, selectedPondFilter, selectedTierFilter, searchQuery]);

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aquaguard_surveillance_ledger_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV
  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ["Timestamp", "Scan_ID", "Pond_ID", "Risk_Score", "Severity_Tier", "Primary_Diagnosis", "Confidence", "DO_mg_l", "pH", "Temp_C", "TAN_mg_l"];
    const rows = history.map(r => [
      `"${r.timestamp || ''}"`,
      `"${r.assessment_id || ''}"`,
      `"${r.pond_id || ''}"`,
      r.risk_score || 0,
      `"${r.severity_tier || ''}"`,
      `"${r.primary_condition || ''}"`,
      r.confidence || '',
      r.telemetry?.dissolved_oxygen_mg_l || '',
      r.telemetry?.ph || '',
      r.telemetry?.temperature_c || '',
      r.telemetry?.total_ammonia_mg_l || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aquaguard_surveillance_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getBadgeStyle = (tier) => {
    switch (tier) {
      case 'EMERGENCY':
        return { bg: 'rgba(244, 63, 94, 0.16)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.45)' };
      case 'WARNING':
        return { bg: 'rgba(249, 115, 22, 0.16)', color: '#f97316', border: '1px solid rgba(249, 115, 22, 0.4)' };
      case 'ADVISORY':
        return { bg: 'rgba(245, 158, 11, 0.16)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)' };
      default:
        return { bg: 'rgba(180, 240, 58, 0.14)', color: '#b4f03a', border: '1px solid rgba(180, 240, 58, 0.35)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Top Breadcrumb & Actions Bar */}
      <div className="card-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={onBackToDiagnostics}
            className="btn-secondary"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
          >
            <ArrowLeft size={15} />
            <span>{t('back_to_live')}</span>
          </button>

          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', height: '28px', margin: '0 0.25rem' }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <History size={18} color="#b4f03a" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f8fafc' }}>
                {t('ledger_title')}
              </h2>
              <span className="status-pill status-normal" style={{ fontSize: '0.65rem' }}>
                {history.length} {t('saved_records')}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {t('ledger_sub')}
            </p>
          </div>
        </div>

        {/* Export & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={handleExportCSV}
            className="btn-secondary"
            style={{ fontSize: '0.775rem', padding: '0.45rem 0.85rem' }}
            disabled={history.length === 0}
          >
            <FileSpreadsheet size={14} color="#b4f03a" />
            <span>{t('download_csv')}</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="btn-secondary"
            style={{ fontSize: '0.775rem', padding: '0.45rem 0.85rem' }}
            disabled={history.length === 0}
          >
            <Download size={14} color="#a78bfa" />
            <span>{t('download_json')}</span>
          </button>

          {onClearHistory && history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="btn-secondary"
              style={{ fontSize: '0.775rem', padding: '0.45rem 0.65rem', color: '#f43f5e' }}
              title="Clear all stored logs"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

      </div>

      {/* KPI Stats Overview Cards (Figma Glassmorphism Top Row with Ambient Corner Glows) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem'
      }}>

        {/* Card 1: Total Scans */}
        <div
          className="card-panel"
          style={{
            padding: '1.1rem',
            background: 'radial-gradient(circle at 90% 90%, rgba(139, 92, 246, 0.16) 0%, transparent 60%), var(--bg-glass-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
              {t('total_checks')}
            </span>
            <Layers size={16} color="#a78bfa" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#f8fafc', marginTop: '0.25rem' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
            {t('across_ponds')}
          </div>
        </div>

        {/* Card 2: Average Danger */}
        <div
          className="card-panel"
          style={{
            padding: '1.1rem',
            background: 'radial-gradient(circle at 90% 90%, rgba(180, 240, 58, 0.16) 0%, transparent 60%), var(--bg-glass-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
              {t('avg_danger')}
            </span>
            <Activity size={16} color="#b4f03a" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#b4f03a', marginTop: '0.25rem' }}>
            {stats.avgScore} <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
            {t('lower_is_healthier')}
          </div>
        </div>

        {/* Card 3: Active Pathogen Alerts */}
        <div
          className="card-panel"
          style={{
            padding: '1.1rem',
            background: 'radial-gradient(circle at 90% 90%, rgba(244, 63, 94, 0.16) 0%, transparent 60%), var(--bg-glass-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
              {t('ponds_needing_attention')}
            </span>
            <ShieldAlert size={16} color={stats.emergencyCount > 0 ? '#f43f5e' : '#b4f03a'} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: stats.emergencyCount > 0 ? '#f43f5e' : '#b4f03a', marginTop: '0.25rem' }}>
            {stats.emergencyCount}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
            {t('ponds_in_warning')}
          </div>
        </div>

        {/* Card 4: Safe Condition Ratio */}
        <div
          className="card-panel"
          style={{
            padding: '1.1rem',
            background: 'radial-gradient(circle at 90% 90%, rgba(16, 185, 129, 0.16) 0%, transparent 60%), var(--bg-glass-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
              {t('ponds_in_safe')}
            </span>
            <CheckCircle2 size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#10b981', marginTop: '0.25rem' }}>
            {stats.normalRatio}%
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
            {t('pct_safe')}
          </div>
        </div>

      </div>

      {/* Filter & Search Controls (Frosted Glass Panel) */}
      <div className="card-panel" style={{ padding: '0.85rem 1.25rem', position: 'relative', zIndex: (isPondMenuOpen || isTierMenuOpen) ? 100 : 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>

          {/* Search box */}
          <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 240px' }}>
            <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(14, 18, 26, 0.45)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderRadius: '10px',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                outline: 'none',
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)'
              }}
            />
          </div>

          {/* Pond filter (Custom Glassmorphic Dropdown) */}
          <div ref={pondMenuRef} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', position: 'relative' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>{t('pond_filter_label')}</span>
            <button
              type="button"
              onClick={() => {
                setIsPondMenuOpen(!isPondMenuOpen);
                setIsTierMenuOpen(false);
              }}
              style={{
                background: 'rgba(14, 18, 26, 0.45)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: isPondMenuOpen ? '1px solid #b4f03a' : '1px solid rgba(255, 255, 255, 0.10)',
                color: 'var(--text-main)',
                padding: '0.4rem 0.75rem',
                borderRadius: '10px',
                fontSize: '0.775rem',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '150px',
                justifyContent: 'space-between'
              }}
            >
              <span>{selectedPondFilter === 'ALL' ? t('all_ponds') : ponds.find(p => (p.id || p.pond_id) === selectedPondFilter)?.name || selectedPondFilter}</span>
              <ChevronDown size={13} color={isPondMenuOpen ? '#b4f03a' : 'var(--text-muted)'} style={{ transform: isPondMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {isPondMenuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: '42px',
                minWidth: '200px',
                background: 'rgba(14, 18, 26, 0.94)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '12px',
                padding: '0.35rem',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem'
              }}>
                <button
                  type="button"
                  onClick={() => { setSelectedPondFilter('ALL'); setIsPondMenuOpen(false); }}
                  style={{
                    padding: '0.45rem 0.65rem',
                    borderRadius: '7px',
                    background: selectedPondFilter === 'ALL' ? 'rgba(180, 240, 58, 0.15)' : 'transparent',
                    color: selectedPondFilter === 'ALL' ? '#b4f03a' : '#f8fafc',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '0.775rem',
                    fontWeight: selectedPondFilter === 'ALL' ? '700' : '500',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{t('all_ponds')}</span>
                  {selectedPondFilter === 'ALL' && <Check size={13} color="#b4f03a" />}
                </button>
                {ponds.map(p => {
                  const pid = p.id || p.pond_id;
                  const isSel = selectedPondFilter === pid;
                  return (
                    <button
                      key={pid}
                      type="button"
                      onClick={() => { setSelectedPondFilter(pid); setIsPondMenuOpen(false); }}
                      style={{
                        padding: '0.45rem 0.65rem',
                        borderRadius: '7px',
                        background: isSel ? 'rgba(180, 240, 58, 0.15)' : 'transparent',
                        color: isSel ? '#b4f03a' : '#f8fafc',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.775rem',
                        fontWeight: isSel ? '700' : '500',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{p.name}</span>
                      {isSel && <Check size={13} color="#b4f03a" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Severity Tier filter (Custom Glassmorphic Dropdown) */}
          <div ref={tierMenuRef} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', position: 'relative' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>{t('status_filter_label')}</span>
            <button
              type="button"
              onClick={() => {
                setIsTierMenuOpen(!isTierMenuOpen);
                setIsPondMenuOpen(false);
              }}
              style={{
                background: 'rgba(14, 18, 26, 0.45)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: isTierMenuOpen ? '1px solid #b4f03a' : '1px solid rgba(255, 255, 255, 0.10)',
                color: 'var(--text-main)',
                padding: '0.4rem 0.75rem',
                borderRadius: '10px',
                fontSize: '0.775rem',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '130px',
                justifyContent: 'space-between'
              }}
            >
              <span>{selectedTierFilter === 'ALL' ? t('all_statuses') : translateTier(selectedTierFilter, true)}</span>
              <ChevronDown size={13} color={isTierMenuOpen ? '#b4f03a' : 'var(--text-muted)'} style={{ transform: isTierMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {isTierMenuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: '38px',
                minWidth: '150px',
                background: 'rgba(14, 18, 26, 0.94)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '12px',
                padding: '0.35rem',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem'
              }}>
                {
                  ['ALL', 'NORMAL', 'ADVISORY', 'WARNING', 'EMERGENCY'].map(tCode => {
                    const isSel = selectedTierFilter === tCode;
                    let color = '#f8fafc';
                    if (tCode === 'NORMAL') color = '#b4f03a';
                    if (tCode === 'ADVISORY') color = '#f59e0b';
                    if (tCode === 'WARNING') color = '#f97316';
                    if (tCode === 'EMERGENCY') color = '#f43f5e';

                    return (
                      <button
                        key={tCode}
                        type="button"
                        onClick={() => { setSelectedTierFilter(tCode); setIsTierMenuOpen(false); }}
                        style={{
                          padding: '0.45rem 0.65rem',
                          borderRadius: '7px',
                          background: isSel ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                          color: color,
                          border: 'none',
                          textAlign: 'left',
                          fontSize: '0.775rem',
                          fontWeight: isSel ? '700' : '500',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{tCode === 'ALL' ? t('all_statuses') : translateTier(tCode, true)}</span>
                        {isSel && <Check size={13} color={color} />}
                      </button>
                    );
                  })
                }
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Ledger Table (Frosted Glass Container) */}
      <div className="card-panel" style={{ padding: '0', overflow: 'hidden' }}>

        {filteredRecords.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            <History size={32} color="#b4f03a" style={{ marginBottom: '0.5rem', opacity: 0.7 }} />
            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#f1f5f9' }}>
              {t('no_records_found')}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {t('no_records_hint')}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(14, 18, 26, 0.50)', borderBottom: '1px solid rgba(255, 255, 255, 0.10)' }}>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-dim)', fontWeight: '700' }}>{t('th_photo')}</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-dim)', fontWeight: '700' }}>{t('th_date')}</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-dim)', fontWeight: '700' }}>{t('th_pond')}</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-dim)', fontWeight: '700' }}>{t('th_health')}</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-dim)', fontWeight: '700' }}>{t('th_water')}</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-dim)', fontWeight: '700' }}>{t('th_danger')}</th>
                  <th style={{ padding: '0.75rem 1rem', color: 'var(--text-dim)', fontWeight: '700', textAlign: 'right' }}>{t('th_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, idx) => {
                  const badge = getBadgeStyle(record.severity_tier);
                  const dateStr = record.timestamp ? new Date(record.timestamp).toLocaleString() : 'Just now';
                  const tel = record.telemetry;

                  return (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(180, 240, 58, 0.04)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'}
                    >
                      {/* Thumbnail */}
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div
                          onClick={() => setSelectedRecordForModal(record)}
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: 'pointer',
                            background: '#121419',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                          }}
                          title="Click to view full checkup details"
                        >
                          {record.image_preview ? (
                            <img
                              src={record.image_preview}
                              alt="Fish Photo"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Eye size={18} color="var(--text-dim)" />
                          )}
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {dateStr}
                        <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>
                          ID: {(record.assessment_id || 'scan-01').slice(0, 12)}...
                        </div>
                      </td>

                      {/* Pond */}
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ fontWeight: '700', color: '#f1f5f9' }}>
                          {record.pond_id}
                        </span>
                      </td>

                      {/* Condition & Confidence */}
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ fontWeight: '700', color: record.primary_condition?.includes('Healthy') ? '#b4f03a' : '#f97316' }}>
                          {translateDisease(record.primary_condition)}
                        </div>
                        {record.confidence && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                            {t('certainty')}: {(record.confidence * 100).toFixed(1)}%
                          </div>
                        )}
                      </td>

                      {/* Telemetry Snapshot */}
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-sans)', fontSize: '0.725rem' }}>
                        {tel ? (
                          <div>
                            <span style={{ color: tel.dissolved_oxygen_mg_l < 3.5 ? '#f43f5e' : '#b4f03a', fontWeight: '600' }}>{t('oxygen_abbr')}: {tel.dissolved_oxygen_mg_l}</span> •{' '}
                            <span style={{ color: '#a78bfa', fontWeight: '600' }}>{t('ph_abbr')}: {tel.ph}</span> •{' '}
                            <span style={{ color: '#f59e0b', fontWeight: '600' }}>{t('temp_abbr')}: {tel.temperature_c}°C</span> •{' '}
                            <span style={{ color: '#b4f03a', fontWeight: '600' }}>{t('waste_abbr')}: {tel.total_ammonia_mg_l}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-dim)' }}>No water data</span>
                        )}
                      </td>

                      {/* Risk Score & Tier Badge */}
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            fontSize: '1rem',
                            fontWeight: '800',
                            fontFamily: 'var(--font-sans)',
                            color: badge.color
                          }}>
                            {Number(record.risk_score || 0).toFixed(0)}
                          </span>
                          <span style={{
                            padding: '0.15rem 0.5rem',
                            borderRadius: '999px',
                            background: badge.bg,
                            border: badge.border,
                            color: badge.color,
                            fontSize: '0.65rem',
                            fontWeight: '800',
                            fontFamily: 'var(--font-sans)',
                            textTransform: 'uppercase'
                          }}>
                            {translateTier(record.severity_tier, true)}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.45rem' }}>
                          <button
                            onClick={() => setSelectedRecordForModal(record)}
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.725rem' }}
                            title="Inspect full details"
                          >
                            <Eye size={12} />
                            <span>{t('view_details')}</span>
                          </button>
                          {onLoadHistoricScan && (
                            <button
                              onClick={() => onLoadHistoricScan(record)}
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.725rem', borderColor: 'rgba(180, 240, 58, 0.4)', color: '#b4f03a' }}
                              title="Load this scan state into live dashboard"
                            >
                              <span>{t('load_live')}</span>
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Clinical Details Modal (Deep Frosted Glass Modal) */}
      {selectedRecordForModal && (
        < div
          data-lenis-prevent="true"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(3, 4, 7, 0.75)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
              overscrollBehavior: 'contain'
            }}
          >
            <div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(14, 18, 26, 0.65)',
                backdropFilter: 'blur(32px) saturate(200%)',
                WebkitBackdropFilter: 'blur(32px) saturate(200%)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '22px',
                maxWidth: '680px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '1.5rem',
                boxShadow: '0 32px 70px rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255, 255, 255, 0.30)'
              }}>

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc' }}>
                    {t('modal_title')}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)' }}>
                    {t('modal_record_id')} {selectedRecordForModal.assessment_id}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedRecordForModal(null)}
                  className="btn-secondary"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                >
                  ✕ {t('modal_close')}
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Photo & Diagnosis Split */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                  {selectedRecordForModal.image_preview && (
                    <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <img
                        src={selectedRecordForModal.image_preview}
                        alt="Fish Photo"
                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      {t('main_finding')}
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: selectedRecordForModal.primary_condition?.includes('Healthy') ? '#b4f03a' : '#f97316' }}>
                      {translateDisease(selectedRecordForModal.primary_condition)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Pond: <strong>{selectedRecordForModal.pond_id}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Recorded: {new Date(selectedRecordForModal.timestamp).toLocaleString()}
                    </div>
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        background: getBadgeStyle(selectedRecordForModal.severity_tier).bg,
                        border: getBadgeStyle(selectedRecordForModal.severity_tier).border,
                        color: getBadgeStyle(selectedRecordForModal.severity_tier).color,
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        fontFamily: 'var(--font-sans)'
                      }}>
                        {translateTier(selectedRecordForModal.severity_tier, true)} ({t('meter_label')}: {Number(selectedRecordForModal.risk_score || 0).toFixed(0)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Physicochemical Snapshot */}
                {selectedRecordForModal.telemetry && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
                      {t('water_test_readings_hdr')}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                      <div className="metric-box" style={{ padding: '0.45rem' }}>
                        <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>{t('oxygen_abbr')}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#b4f03a' }}>
                          {selectedRecordForModal.telemetry.dissolved_oxygen_mg_l} mg/L
                        </div>
                      </div>
                      <div className="metric-box" style={{ padding: '0.45rem' }}>
                        <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>{t('ph_abbr')}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#a78bfa' }}>
                          {selectedRecordForModal.telemetry.ph}
                        </div>
                      </div>
                      <div className="metric-box" style={{ padding: '0.45rem' }}>
                        <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>{t('temp_abbr')}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#f59e0b' }}>
                          {selectedRecordForModal.telemetry.temperature_c} °C
                        </div>
                      </div>
                      <div className="metric-box" style={{ padding: '0.45rem' }}>
                        <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>{t('waste_abbr')}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: '#b4f03a' }}>
                          {selectedRecordForModal.telemetry.total_ammonia_mg_l} mg/L
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action plan summary if available */}
                {selectedRecordForModal.prescriptions && selectedRecordForModal.prescriptions.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
                      {t('recommended_care_steps_hdr')} ({selectedRecordForModal.prescriptions.length} {t('steps_to_take')})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {selectedRecordForModal.prescriptions.slice(0, 3).map((item, pidx) => (
                        <div key={pidx} style={{ background: 'rgba(20, 23, 31, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>
                          <div style={{ fontWeight: '700', color: '#f1f5f9' }}>{t('step')} {item.priority}. {item.title}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.15rem' }}>{item.instruction}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modal Footer with Load Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => setSelectedRecordForModal(null)}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                  >
                    {t('modal_close')}
                  </button>
                  {onLoadHistoricScan && (
                    <button
                      onClick={() => {
                        const rec = selectedRecordForModal;
                        setSelectedRecordForModal(null);
                        onLoadHistoricScan(rec);
                      }}
                      className="btn-primary"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem' }}
                    >
                      {t('load_live')}
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>
      )}

        </div>
      );
}
