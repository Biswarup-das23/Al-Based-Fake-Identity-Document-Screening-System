import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PresetBar from './components/PresetBar';
import DocumentIngestion from './components/DocumentIngestion';
import MRZTerminal from './components/MRZTerminal';
import ForensicViewer from './components/ForensicViewer';
import BiometricsPanel from './components/BiometricsPanel';
import RiskDecisionPanel from './components/RiskDecisionPanel';
import AuditReportModal from './components/AuditReportModal';
import NewPassengerModal from './components/NewPassengerModal';
import confetti from 'canvas-confetti';

export default function App() {
  const [presets, setPresets] = useState([]);
  const [activePresetId, setActivePresetId] = useState("preset_genuine_passport");
  const [documentImage, setDocumentImage] = useState(null);
  const [liveImage, setLiveImage] = useState(null);
  const [mrzText, setMrzText] = useState("");
  const [screeningResult, setScreeningResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isNewPassengerModalOpen, setIsNewPassengerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const selectPreset = async (presetId) => {
    setActivePresetId(presetId);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/presets/${presetId}`);
      const data = await res.json();
      setDocumentImage(data.image_b64);
      setLiveImage(data.live_passenger_b64 || null);
      setMrzText(data.mrz_raw);
      const screenRes = await fetch('/api/screen-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preset_id: presetId,
          mrz_text_raw: data.mrz_raw,
          live_passenger_b64: data.live_passenger_b64 || null
        })
      });
      const screenData = await screenRes.json();
      setScreeningResult(screenData);
    } catch (err) {
      console.error("Error loading preset:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPresets = async (selectId = null) => {
    try {
      const res = await fetch('/api/presets');
      const data = await res.json();
      if (data?.presets) {
        setPresets(data.presets);
        if (selectId) {
          selectPreset(selectId);
        } else if (!activePresetId || activePresetId === "preset_genuine_passport") {
          selectPreset("preset_genuine_passport");
        }
      }
    } catch (err) {
      console.error("Failed to fetch presets:", err);
    }
  };

  useEffect(() => { fetchPresets(); }, []);

  const handleNewPassengerCreated = (newPassenger, newScreening) => {
    // Add to list and switch to it immediately
    setPresets((prev) => [newPassenger, ...prev.filter(p => p.id !== newPassenger.id)]);
    setActivePresetId(newPassenger.id);
    setDocumentImage(newPassenger.image_b64);
    setLiveImage(newPassenger.live_passenger_b64 || null);
    setMrzText(newPassenger.mrz_raw);
    setScreeningResult(newScreening);
    setActiveTab('overview');

    const decision = newScreening?.risk_assessment?.recommended_decision || "";
    const tier = newScreening?.risk_assessment?.risk_tier || "LOW";

    if (tier === "LOW" || decision.includes("GRANT")) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      showToast(`✓ Passenger ${newPassenger.holder_name} registered & verified (Low Risk)!`, "success");
    } else {
      showToast(`⚠ Passenger ${newPassenger.holder_name} flagged: ${decision} (${tier} Risk)!`, "error");
    }
  };

  const handleDeletePassenger = async (passengerId) => {
    try {
      const res = await fetch(`/api/passengers/${passengerId}`, { method: 'DELETE' });
      if (res.ok) {
        setPresets((prev) => prev.filter((p) => p.id !== passengerId));
        if (activePresetId === passengerId) {
          selectPreset("preset_genuine_passport");
        }
        showToast("Passenger removed from active screening session.", "info");
      }
    } catch (err) {
      showToast("Failed to delete passenger: " + err.message, "error");
    }
  };

  const runManualScreening = async () => {
    if (!documentImage) return;
    setIsLoading(true);
    try {
      const payload = {
        document_image_b64: documentImage,
        live_passenger_b64: liveImage,
        mrz_text_raw: mrzText,
        preset_id: activePresetId
      };
      const res = await fetch('/api/screen-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setScreeningResult(data);
      showToast("AI forensic screening complete!", "success");
    } catch (err) {
      showToast("Screening error: " + err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeAction = (actionType) => {
    if (actionType === "GRANT_ENTRY") {
      confetti({ particleCount: 100, spread: 75, origin: { y: 0.6 } });
      showToast("✓ Entry Granted & Stamped! Record logged to border ledger.", "success");
    } else if (actionType === "SECONDARY_INSPECTION") {
      showToast("⚠ Traveler routed to Secondary Inspection Counter 4B.", "warning");
    } else if (actionType === "DETAIN_SUBJECT") {
      showToast("🚨 SECURITY DISPATCHED! Traveler detained for interrogation.", "error");
    }
  };

  const showToast = (msg, type = "info") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const hasCriticalAlert = screeningResult?.watchlist_screening?.flagged ||
    screeningResult?.risk_assessment?.risk_tier === "CRITICAL";

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden">

      {/* Cinematic animated background */}
      <div className="app-bg" aria-hidden="true">
        <div className="grid-overlay" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Content layer */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Critical threat banner */}
        {hasCriticalAlert && (
          <div className="animate-flicker bg-red-950/80 border-b border-red-500/60 px-6 py-2 flex items-center justify-center gap-3 text-xs font-mono font-bold text-red-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            🚨 SECURITY ALERT — CRITICAL THREAT PROFILE DETECTED — DETAIN INDIVIDUAL — NOTIFY SUPERVISOR
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          </div>
        )}

        {/* Header */}
        <Header
          screeningResult={screeningResult}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNewPassengerModal={() => setIsNewPassengerModalOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">

          {/* Preset Bar */}
          <PresetBar
            presets={presets}
            activePresetId={activePresetId}
            onSelectPreset={selectPreset}
            isLoading={isLoading}
            onOpenNewPassengerModal={() => setIsNewPassengerModalOpen(true)}
            onDeletePassenger={handleDeletePassenger}
          />

          {/* Tab: Overview HUD */}
          {(activeTab === 'overview' || activeTab === undefined) && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DocumentIngestion
                  documentImage={documentImage}
                  setDocumentImage={setDocumentImage}
                  liveImage={liveImage}
                  setLiveImage={setLiveImage}
                  mrzText={mrzText}
                  setMrzText={setMrzText}
                  onRunScreening={runManualScreening}
                  isLoading={isLoading}
                />
                <BiometricsPanel
                  biometricsData={screeningResult?.biometrics}
                  documentImage={documentImage}
                  liveImage={liveImage}
                />
              </div>
              <RiskDecisionPanel
                riskAssessment={screeningResult?.risk_assessment}
                auditReport={screeningResult?.audit_report}
                onOpenAuditModal={() => setIsAuditModalOpen(true)}
                onTakeAction={handleTakeAction}
              />
            </div>
          )}

          {/* Tab: Forensics Studio */}
          {activeTab === 'forensics' && (
            <ForensicViewer forensicsData={screeningResult?.forensics} />
          )}

          {/* Tab: MRZ & Validation */}
          {activeTab === 'mrz' && (
            <MRZTerminal
              extractedData={screeningResult?.extracted_data}
              validationData={screeningResult?.document_validation}
              watchlistData={screeningResult?.watchlist_screening}
            />
          )}

          {/* Tab: Biometrics */}
          {activeTab === 'biometrics' && (
            <BiometricsPanel
              biometricsData={screeningResult?.biometrics}
              documentImage={documentImage}
              liveImage={liveImage}
            />
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 glass-deep py-4 px-8 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>AegisBorder AI • ICAO Doc 9303 Compliant • Multi-Spectral Forensic Engine v2.4</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            GATE-14 / DEL IGI • OFFICER: B. DAS [7419]
          </span>
        </footer>

      </div>

      {/* New Passenger Registration Modal for IRL Testing */}
      <NewPassengerModal
        isOpen={isNewPassengerModalOpen}
        onClose={() => setIsNewPassengerModalOpen(false)}
        onPassengerCreated={handleNewPassengerCreated}
      />

      {/* Audit Modal */}
      <AuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        screeningResult={screeningResult}
      />

      {/* Toast */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-[60] px-5 py-3.5 rounded-2xl border shadow-2xl font-mono text-xs flex items-center gap-2.5 backdrop-blur-xl transition-all ${
          toastMessage.type === "success" ? "bg-emerald-950/90 border-emerald-500/60 text-emerald-300 shadow-emerald-500/20" :
          toastMessage.type === "error"   ? "bg-rose-950/90 border-rose-500/60 text-rose-300 shadow-rose-500/20" :
          toastMessage.type === "warning" ? "bg-amber-950/90 border-amber-500/60 text-amber-300 shadow-amber-500/20" :
          "bg-slate-900/90 border-cyan-500/60 text-cyan-300 shadow-cyan-500/20"
        }`}>
          <span>{toastMessage.msg}</span>
        </div>
      )}
    </div>
  );
}
