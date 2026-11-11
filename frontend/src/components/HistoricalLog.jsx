import React from 'react';
import { History, FileText, Download, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function HistoricalLog({ history, onSelectHistoricalItem }) {
  const getBadgeStyle = (tier) => {
    switch (tier) {
      case 'EMERGENCY':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' };
      case 'WARNING':
        return { bg: 'rgba(249, 115, 22, 0.15)', color: '#f97316', border: '1px solid rgba(249, 115, 22, 0.3)' };
      case 'ADVISORY':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' };
      default:
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' };
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aquaguard_assessment_log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="card-panel">
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={16} color="#00b4d8" />
          <h2 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>
            Pond Surveillance Ledger
          </h2>
        </div>

        <button
          onClick={handleExportJSON}
          className="btn-secondary"
          style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
          title="Export scan logs as JSON"
        >
          <Download size={13} />
          Export JSON
        </button>
      </div>

      {/* History Items */}
      {history.length === 0 ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
          No assessments logged yet. Run a scan or click a Judge Preset to record telemetry.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {history.map((record, idx) => {
            const badge = getBadgeStyle(record.severity_tier);
            const dateStr = record.timestamp ? new Date(record.timestamp).toLocaleTimeString() : 'Just now';
            return (
              <div
                key={idx}
                style={{
                  background: '#091621',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  transition: 'background 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f1f5f9' }}>
                      {record.pond_id}
                    </span>
                    <span style={{
                      fontSize: '0.675rem',
                      fontWeight: '700',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-sans)',
                      background: badge.bg,
                      color: badge.color,
                      border: badge.border
                    }}>
                      Score: {record.risk_score} • {record.severity_tier}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Diagnosis: <span style={{ color: '#cbd5e1' }}>{record.primary_condition}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)' }}>
                    {dateStr}
                  </span>
                  {onSelectHistoricalItem && (
                    <button
                      onClick={() => onSelectHistoricalItem(record)}
                      className="btn-secondary"
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                    >
                      View
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

