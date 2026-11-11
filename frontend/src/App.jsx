import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header';

gsap.registerPlugin(ScrollTrigger);
import JudgePresetsBar from './components/JudgePresetsBar';
import RiskGauge from './components/RiskGauge';
import DiagnosticScanner from './components/DiagnosticScanner';
import WaterTelemetryPanel from './components/WaterTelemetryPanel';
import ActionPlanCard from './components/ActionPlanCard';
import SurveillanceLedgerScreen from './components/SurveillanceLedgerScreen';
import AmbientRibbonBackground from './components/AmbientRibbonBackground';

import {
  checkBackendHealth,
  getPonds,
  evaluateWaterQuality,
  analyzeFishImage,
  assessPondMultimodal,
  JUDGE_PRESETS
} from './services/api';

const DEFAULT_PONDS = [
  { id: 'pond_01', pond_id: 'pond_01', name: 'Nursery Pond Alpha (Tilapia)' },
  { id: 'pond_02', pond_id: 'pond_02', name: 'Grow-out Pond Bravo (Carp)' },
  { id: 'pond_03', pond_id: 'pond_03', name: 'Broodstock Pond Charlie (Pangasius)' }
];

export default function App() {
  const [backendStatus, setBackendStatus] = useState({ status: 'healthy' });
  const [ponds, setPonds] = useState(DEFAULT_PONDS);
  const [selectedPond, setSelectedPond] = useState('pond_01');

  // Navigation: 'diagnostics' (real-time dashboard) or 'ledger' (full-screen surveillance ledger)
  const [currentView, setCurrentView] = useState('diagnostics');

  // Telemetry state
  const [telemetry, setTelemetry] = useState(JUDGE_PRESETS[0].telemetry);

  // Image & Diagnostic state
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [currentImagePreview, setCurrentImagePreview] = useState(null);
  const [visualAnalysis, setVisualAnalysis] = useState(null);
  const [waterEvaluation, setWaterEvaluation] = useState(null);
  const [assessment, setAssessment] = useState(null);

  // UI Loading and Presets
  const [activePresetId, setActivePresetId] = useState('optimal');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);

  // History ledger
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('aquaguard_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem('aquaguard_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Butter-Smooth Inertial Scrolling (Lenis + GSAP ScrollTrigger Sync)
  const lenisRef = useRef(null);

  useEffect(() => {
    // Ultra-smooth liquid-silk interpolation physics (lerp: 0.075)
    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
      autoRaf: false,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    // Connect Lenis scroll updates to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis through GSAP high-precision ticker
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // GSAP ScrollTrigger Animations
    const ctx = gsap.context(() => {
      // 1. Glowing Hairline Scroll Progress Bar at top of viewport
      gsap.to('.scroll-progress-bar', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          start: 'top top',
          end: 'max',
          scrub: 0.2,
        }
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
    };
  }, []);

  // Smooth scroll to top when switching between Diagnostics and Surveillance Ledger
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: false, duration: 0.8 });
    }
  }, [currentView]);

  // Initial check & recurring health poll
  useEffect(() => {
    let isMounted = true;
    async function refreshHealth() {
      const health = await checkBackendHealth();
      if (isMounted) setBackendStatus(health);
    }
    refreshHealth();

    async function initData() {
      const pondsList = await getPonds();
      if (isMounted && Array.isArray(pondsList) && pondsList.length > 0) {
        setPonds(pondsList);
      }
      // Preload Preset 1 (Optimal)
      applyPresetInternal(JUDGE_PRESETS[0], false);
    }
    initData();

    // Poll health every 3 seconds
    const timer = setInterval(refreshHealth, 3000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  // Helper to fetch realistic fish specimen images for presets
  const getPresetImageFile = async (preset) => {
    let samplePath = '/samples/healthy_tilapia.jpg';
    if (preset.id === 'columnaris') samplePath = '/samples/columnaris_gill_disease.jpg';
    if (preset.id === 'hypoxia_emergency') samplePath = '/samples/danger_red_disease_ulcer.jpg';

    try {
      const res = await fetch(samplePath);
      if (res.ok) {
        const blob = await res.blob();
        return { file: new File([blob], preset.hint, { type: 'image/jpeg' }), previewUrl: samplePath };
      }
    } catch (err) {
      console.warn('Could not load sample image from path, using fallback', err);
    }

    return { file: null, previewUrl: samplePath };
  };

  const applyPresetInternal = async (preset, addHistory = true) => {
    setActivePresetId(preset.id);
    setTelemetry(preset.telemetry);
    setSelectedPond(preset.pondId);
    setIsAssessing(true);

    try {
      const { file: specimenFile, previewUrl } = await getPresetImageFile(preset);
      setCurrentImagePreview(previewUrl);
      if (specimenFile) {
        setSelectedImageFile(specimenFile);
      }

      // Construct form for unified multimodal assessment
      const formData = new FormData();
      formData.append('pond_id', preset.pondId);
      if (specimenFile) {
        formData.append('image', specimenFile);
        formData.append('file', specimenFile);
      }
      formData.append('dissolved_oxygen_mg_l', preset.telemetry.dissolved_oxygen_mg_l);
      formData.append('ph', preset.telemetry.ph);
      formData.append('temperature_c', preset.telemetry.temperature_c);
      formData.append('total_ammonia_mg_l', preset.telemetry.total_ammonia_mg_l);
      formData.append('turbidity_ntu', preset.telemetry.turbidity_ntu);
      formData.append('filename_hint', preset.hint);

      const result = await assessPondMultimodal(formData);
      setAssessment(result);
      setVisualAnalysis(result.visual_diagnosis);
      setWaterEvaluation(result.water_quality);

      if (addHistory) {
        const newRecord = {
          assessment_id: result.assessment_id || result.scan_id,
          pond_id: result.pond_id,
          timestamp: result.assessed_at || result.timestamp,
          risk_score: result.composite_risk_score.final_score,
          severity_tier: result.composite_risk_score.severity_tier,
          primary_condition: result.visual_diagnosis.primary_condition,
          confidence: result.visual_diagnosis.confidence_score,
          telemetry: { ...preset.telemetry },
          image_preview: previewUrl,
          prescriptions: result.prescriptive_action_plan
        };
        setHistory((prev) => [newRecord, ...prev.slice(0, 49)]);
      }
    } catch (err) {
      console.error('Failed to execute preset assessment:', err);
    } finally {
      setIsAssessing(false);
    }
  };

  const handleApplyPreset = (preset) => {
    applyPresetInternal(preset, true);
  };

  const handleImageSelected = async (file) => {
    setSelectedImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setCurrentImagePreview(previewUrl);
    setActivePresetId(null);
    setIsAnalyzing(true);

    try {
      // 1. Analyze fish image
      const visionResult = await analyzeFishImage(file, selectedPond, file.name);
      setVisualAnalysis(visionResult);

      // 2. Run multimodal fusion with current telemetry
      const formData = new FormData();
      formData.append('pond_id', selectedPond);
      formData.append('image', file);
      formData.append('file', file);
      formData.append('dissolved_oxygen_mg_l', telemetry.dissolved_oxygen_mg_l);
      formData.append('ph', telemetry.ph);
      formData.append('temperature_c', telemetry.temperature_c);
      formData.append('total_ammonia_mg_l', telemetry.total_ammonia_mg_l);
      formData.append('turbidity_ntu', telemetry.turbidity_ntu);
      formData.append('filename_hint', file.name);

      const assessResult = await assessPondMultimodal(formData);
      setAssessment(assessResult);
      setWaterEvaluation(assessResult.water_quality);

      const newRecord = {
        assessment_id: assessResult.assessment_id || assessResult.scan_id,
        pond_id: assessResult.pond_id,
        timestamp: assessResult.assessed_at || assessResult.timestamp,
        risk_score: assessResult.composite_risk_score.final_score,
        severity_tier: assessResult.composite_risk_score.severity_tier,
        primary_condition: assessResult.visual_diagnosis.primary_condition,
        confidence: assessResult.visual_diagnosis.confidence_score,
        telemetry: { ...telemetry },
        image_preview: previewUrl,
        prescriptions: assessResult.prescriptive_action_plan
      };
      setHistory((prev) => [newRecord, ...prev.slice(0, 49)]);
    } catch (err) {
      console.error('Diagnostic scan failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEvaluateWater = async () => {
    setIsEvaluating(true);
    setActivePresetId(null);
    try {
      const waterRes = await evaluateWaterQuality(telemetry);
      setWaterEvaluation(waterRes);

      // Re-run multimodal assessment if we have an image
      if (selectedImageFile) {
        const formData = new FormData();
        formData.append('pond_id', selectedPond);
        formData.append('image', selectedImageFile);
        formData.append('file', selectedImageFile);
        formData.append('dissolved_oxygen_mg_l', telemetry.dissolved_oxygen_mg_l);
        formData.append('ph', telemetry.ph);
        formData.append('temperature_c', telemetry.temperature_c);
        formData.append('total_ammonia_mg_l', telemetry.total_ammonia_mg_l);
        formData.append('turbidity_ntu', telemetry.turbidity_ntu);

        const assessRes = await assessPondMultimodal(formData);
        setAssessment(assessRes);
      }
    } catch (err) {
      console.error('Water evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Callback to load an item from the ledger back into the live diagnostics dashboard
  const handleLoadHistoricScan = (record) => {
    if (record.telemetry) {
      setTelemetry(record.telemetry);
    }
    if (record.pond_id) {
      setSelectedPond(record.pond_id);
    }
    if (record.image_preview) {
      setCurrentImagePreview(record.image_preview);
    }
    setCurrentView('diagnostics');
  };

  // Clear history
  const handleClearHistory = () => {
      if (window.confirm('Are you sure you want to delete all saved checkup records?')) {
        setHistory([]);
        try {
          localStorage.removeItem('aquaguard_history');
        } catch (e) {
          console.warn('Failed to remove history from storage', e);
        }
      }
    };

    return (
      <>
        {/* Butter-Smooth GSAP Scroll Progress Indicator */}
        <div
          className="scroll-progress-bar"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '2.5px',
            background: 'linear-gradient(90deg, #8b5cf6 0%, #b4f03a 50%, #f97316 100%)',
            zIndex: 9999,
            transformOrigin: '0% 50%',
            transform: 'scaleX(0)',
            boxShadow: '0 0 12px rgba(180, 240, 58, 0.65)',
            pointerEvents: 'none'
          }}
        />

        {/* Pitch-Black Obsidian Canvas & 3D Glowing Ribbon Mesh Layer */}
        <AmbientRibbonBackground />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1440px', margin: '0 auto', padding: '1.25rem 1rem' }}>

          {/* Top Header Bar with View Switcher */}
          <Header
            backendStatus={backendStatus}
            selectedPond={selectedPond}
            onSelectPond={setSelectedPond}
            ponds={ponds}
            currentView={currentView}
            onChangeView={setCurrentView}
            historyCount={history.length}
          />

          {/* Screen 1: Dedicated Pond Surveillance Ledger */}
          {currentView === 'ledger' ? (
            <SurveillanceLedgerScreen
              history={history}
              onBackToDiagnostics={() => setCurrentView('diagnostics')}
              onLoadHistoricScan={handleLoadHistoricScan}
              onClearHistory={handleClearHistory}
              ponds={ponds}
            />
          ) : (
            /* Screen 2: Real-Time Diagnostic Dashboard */
            <>
              {/* Judge Evaluation Presets Bar (FR-07) */}
              <JudgePresetsBar
                activePresetId={activePresetId}
                onApplyPreset={handleApplyPreset}
                isAssessing={isAssessing}
              />

              {/* Main Two-Column Layout */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.25fr)',
                gap: '1.25rem',
                alignItems: 'start'
              }}>

                {/* Left Column: Risk Gauge & Action Plan */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                  {/* Circular SVG Multimodal Risk Gauge */}
                  <RiskGauge
                    assessment={assessment}
                    isAssessing={isAssessing}
                  />

                  {/* Action Plan */}
                  <ActionPlanCard
                    prescriptivePlan={assessment?.prescriptive_action_plan}
                    selectedPond={selectedPond}
                    currentPondName={ponds.find(p => (p.id || p.pond_id) === selectedPond)?.name || 'Nursery Pond Alpha (Tilapia)'}
                    telemetry={telemetry}
                  />

                </div>

                {/* Right Column: Diagnostic Scanner & Water Telemetry */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                  {/* Fish Dermal Scanner */}
                  <DiagnosticScanner
                    onImageSelected={handleImageSelected}
                    visualAnalysis={visualAnalysis}
                    isAnalyzing={isAnalyzing}
                    currentImagePreview={currentImagePreview}
                    activeHint={activePresetId}
                  />

                  {/* Water Telemetry Panel */}
                  <WaterTelemetryPanel
                    telemetry={telemetry}
                    onChangeTelemetry={setTelemetry}
                    onEvaluateWater={handleEvaluateWater}
                    waterEvaluation={waterEvaluation}
                    isEvaluating={isEvaluating}
                  />

                </div>

              </div>
            </>
          )}

        </div>
      </>
    );
  }
