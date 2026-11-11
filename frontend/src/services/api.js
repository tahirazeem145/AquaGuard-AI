/**
 * AquaGuard AI - Frontend API Service Layer
 * Connects to the FastAPI backend running MobileNetV3 and Random Forest inference engines.
 */

const API_BASE = '/api/v1';

export async function checkBackendHealth() {
  try {
    let res = await fetch('/health', { method: 'GET' });
    if (!res.ok) {
      res = await fetch('/api/v1/health', { method: 'GET' });
    }
    if (!res.ok) throw new Error('Healthcheck failed');
    return await res.json();
  } catch (err) {
    console.warn('[AquaGuard API] Backend health check fallback:', err);
    try {
      const fallbackRes = await fetch('/api/v1/health', { method: 'GET' });
      if (fallbackRes.ok) return await fallbackRes.json();
    } catch {
      // ignore
    }
    return { status: 'offline', error: err.message };
  }
}

export async function getPonds() {
  const defaultPonds = [
    { id: 'pond_01', pond_id: 'pond_01', name: 'Nursery Pond Alpha (Tilapia)', volume_m3: 2500 },
    { id: 'pond_02', pond_id: 'pond_02', name: 'Grow-out Pond Bravo (Carp)', volume_m3: 1200 },
    { id: 'pond_03', pond_id: 'pond_03', name: 'Broodstock Pond Charlie (Pangasius)', volume_m3: 4000 }
  ];

  try {
    const res = await fetch(`${API_BASE}/ponds`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const rawData = await res.json();
    const list = Array.isArray(rawData) ? rawData : (rawData.ponds || []);
    if (list.length === 0) return defaultPonds;
    return list.map(p => ({
      ...p,
      id: p.id || p.pond_id,
      pond_id: p.id || p.pond_id,
      name: p.name || p.id
    }));
  } catch (err) {
    console.warn('[AquaGuard API] Using default ponds:', err);
    return defaultPonds;
  }
}

export async function evaluateWaterQuality(telemetry) {
  try {
    const res = await fetch(`${API_BASE}/water-quality`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telemetry)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[AquaGuard API] evaluateWaterQuality error:', err);
    throw err;
  }
}

export async function analyzeFishImage(file, pondId = 'pond-alpha', filenameHint = '') {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pond_id', pondId);
    if (filenameHint) {
      formData.append('filename_hint', filenameHint);
    }

    const res = await fetch(`${API_BASE}/analyze-fish`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[AquaGuard API] analyzeFishImage error:', err);
    throw err;
  }
}

export async function assessPondMultimodal(formData) {
  try {
    const res = await fetch(`${API_BASE}/assess-pond`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[AquaGuard API] assessPondMultimodal error:', err);
    throw err;
  }
}

/**
 * Judge Demonstration Presets (PRD FR-07)
 */
export const JUDGE_PRESETS = [
  {
    id: 'optimal',
    title: 'Preset 1: Healthy & Safe Pond',
    description: 'Safe water and healthy fish. Good oxygen level, safe temperature, and clean pond conditions.',
    badge: 'NORMAL',
    pondId: 'pond_01',
    telemetry: {
      dissolved_oxygen_mg_l: 6.8,
      ph: 7.4,
      temperature_c: 26.2,
      total_ammonia_mg_l: 0.20,
      turbidity_ntu: 28.0
    },
    sampleCondition: 'Healthy Fish',
    hint: 'healthy_tilapia_specimen.jpg',
    expectedScore: 0,
    expectedTier: 'NORMAL'
  },
  {
    id: 'columnaris',
    title: 'Preset 2: Sick Fish Warning',
    description: 'Fish showing gill disease signs combined with warm water. Needs close attention and gentle care.',
    badge: 'WARNING',
    pondId: 'pond_02',
    telemetry: {
      dissolved_oxygen_mg_l: 4.2,
      ph: 8.15,
      temperature_c: 28.0,
      total_ammonia_mg_l: 0.45,
      turbidity_ntu: 50.0
    },
    sampleCondition: 'Bacterial gill disease',
    hint: 'columnaris_bacterial_gill_erosion.jpg',
    expectedScore: 72,
    expectedTier: 'WARNING'
  },
  {
    id: 'hypoxia_emergency',
    title: 'Preset 3: Danger - Low Oxygen & Bad Water',
    description: 'Very low oxygen and dangerous ammonia level. Fish are at high risk. Urgent action required!',
    badge: 'EMERGENCY',
    pondId: 'pond_03',
    telemetry: {
      dissolved_oxygen_mg_l: 1.8,
      ph: 8.60,
      temperature_c: 29.5,
      total_ammonia_mg_l: 0.85,
      turbidity_ntu: 85.0
    },
    sampleCondition: 'Bacterial Red disease',
    hint: 'epizootic_ulcerative_syndrome_red_spot.jpg',
    expectedScore: 96,
    expectedTier: 'EMERGENCY'
  }
];

