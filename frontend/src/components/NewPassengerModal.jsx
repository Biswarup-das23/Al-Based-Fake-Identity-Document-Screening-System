import React, { useState, useRef } from 'react';
import {
  X, UserPlus, UploadCloud, Camera, Sparkles,
  AlertTriangle, CheckCircle2, FileText, User,
  Globe, Hash, RefreshCw, ChevronRight
} from 'lucide-react';

const COMMON_COUNTRIES = [
  { code: 'USA', name: 'United States' },
  { code: 'IND', name: 'India' },
  { code: 'GBR', name: 'United Kingdom' },
  { code: 'DEU', name: 'Germany' },
  { code: 'FRA', name: 'France' },
  { code: 'CAN', name: 'Canada' },
  { code: 'AUS', name: 'Australia' },
  { code: 'JPN', name: 'Japan' },
  { code: 'SGP', name: 'Singapore' },
  { code: 'ARE', name: 'United Arab Emirates' },
  { code: 'RUS', name: 'Russian Federation' },
  { code: 'EGY', name: 'Egypt' },
];

const STEP_LABELS = ['Identity', 'Document', 'Biometrics'];

export default function NewPassengerModal({ isOpen, onClose, onPassengerCreated }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    holder_name: '',
    doc_number: '',
    nationality: 'USA',
    dob: '1992-06-15',
    expiry: '2032-06-14',
    sex: 'Male',
    document_type: 'Passport',
    tamper_scenario: 'none',
    notes: '',
    mrz_raw: ''
  });

  const [documentImage, setDocumentImage] = useState(null);
  const [liveImage, setLiveImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const docInputRef = useRef(null);
  const faceInputRef = useRef(null);
  const videoRef = useRef(null);

  if (!isOpen) return null;

  const updateField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setDocumentImage(ev.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFaceUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLiveImage(ev.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch {
      setErrorMsg('Camera access failed. Upload a photo file instead.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setLiveImage(canvas.toDataURL('image/jpeg', 0.92));
      stopCamera();
    }
  };

  const handleNext = () => {
    if (step === 0 && !formData.holder_name.trim()) {
      setErrorMsg('Please enter the passenger full name.');
      return;
    }
    if (step === 1 && !formData.doc_number.trim()) {
      setErrorMsg('Please enter the document number.');
      return;
    }
    setErrorMsg(null);
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!formData.holder_name.trim()) { setErrorMsg('Please enter passenger full name.'); return; }
    if (!formData.doc_number.trim()) { setErrorMsg('Please enter document number.'); return; }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        holder_name: formData.holder_name.toUpperCase().trim(),
        doc_number: formData.doc_number.toUpperCase().trim(),
        document_image_b64: documentImage,
        live_passenger_b64: liveImage
      };

      const res = await fetch('/api/passengers/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to register passenger.');

      onPassengerCreated(data.passenger, data.screening_result);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl bg-slate-900/95 border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        style={{ backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">New Passenger</h2>
                <p className="text-xs text-slate-400 font-mono">Register and run AI border screening</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center">
            {STEP_LABELS.map((label, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                    i < step
                      ? 'bg-cyan-500 border-cyan-500 text-white'
                      : i === step
                        ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300'
                        : 'bg-slate-800 border-white/10 text-slate-500'
                  }`}>
                    {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-[11px] font-mono font-bold transition-colors ${
                    i === step ? 'text-cyan-300' : i < step ? 'text-slate-300' : 'text-slate-500'
                  }`}>{label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 transition-colors ${i < step ? 'bg-cyan-500/50' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 custom-scrollbar">
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 0: Identity */}
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-mono">Enter the passenger&apos;s personal details.</p>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1.5">
                  Full Legal Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. SHARMA PRIYA ANANYA"
                    value={formData.holder_name}
                    onChange={(e) => updateField('holder_name', e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white uppercase tracking-wider font-mono focus:outline-none focus:border-cyan-400/70 focus:ring-1 focus:ring-cyan-400/30 transition placeholder:text-slate-600"
                  />
                  <User className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">Surname first, then given names — as printed on document.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => updateField('dob', e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400/70 transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1.5">Gender / Sex</label>
                  <select
                    value={formData.sex}
                    onChange={(e) => updateField('sex', e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400/70 transition"
                  >
                    <option value="Male">Male (M)</option>
                    <option value="Female">Female (F)</option>
                    <option value="Other">Unspecified</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1.5">Nationality</label>
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {COMMON_COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => updateField('nationality', c.code)}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        formData.nationality === c.code
                          ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="or type 3-letter ICAO code"
                    value={formData.nationality}
                    onChange={(e) => updateField('nationality', e.target.value.toUpperCase())}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 font-bold uppercase tracking-widest font-mono focus:outline-none focus:border-cyan-400/70 transition"
                  />
                  <Globe className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Document */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-mono">Enter travel document details and optionally upload a scan.</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1.5">Document Type</label>
                  <select
                    value={formData.document_type}
                    onChange={(e) => updateField('document_type', e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400/70 transition"
                  >
                    <option value="Passport">Passport (TD3)</option>
                    <option value="Visa">Visa / Permit (TD2)</option>
                    <option value="ID Card">National ID Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1.5">
                    Document Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      placeholder="e.g. P98712344"
                      value={formData.doc_number}
                      onChange={(e) => updateField('doc_number', e.target.value)}
                      className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase tracking-wider font-mono focus:outline-none focus:border-cyan-400/70 transition"
                    />
                    <Hash className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1.5">Date of Expiry</label>
                <input
                  type="date"
                  value={formData.expiry}
                  onChange={(e) => updateField('expiry', e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400/70 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" /> Document Scan (Optional)
                  </label>
                  {documentImage && (
                    <button type="button" onClick={() => setDocumentImage(null)} className="text-[10px] text-rose-400 hover:underline cursor-pointer">Remove</button>
                  )}
                </div>
                <div
                  className="relative min-h-[110px] rounded-xl border-2 border-dashed border-white/15 bg-slate-900/30 flex items-center justify-center overflow-hidden hover:border-cyan-400/40 hover:bg-slate-900/50 transition-all cursor-pointer group"
                  onClick={() => !documentImage && docInputRef.current?.click()}
                >
                  {documentImage ? (
                    <img src={documentImage} alt="Document" className="max-h-[100px] w-auto object-contain rounded" />
                  ) : (
                    <div className="text-center p-3">
                      <UploadCloud className="w-7 h-7 mx-auto mb-1 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      <span className="text-xs font-medium text-slate-300">Click to upload document scan</span>
                      <span className="block text-[10px] text-slate-500 mt-0.5">JPG, PNG, WebP — auto-generated if skipped</span>
                    </div>
                  )}
                  <input type="file" ref={docInputRef} onChange={handleDocUpload} accept="image/*" className="hidden" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1.5">Case Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. VIP clearance, gate 14 arrival..."
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-400/70 transition"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Biometrics */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-400 font-mono">
                Optionally capture a passenger photo for 1:1 biometric face matching.
              </p>

              {/* Summary pill */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white font-mono truncate">{formData.holder_name || '—'}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {formData.doc_number} · {formData.nationality} · {formData.document_type}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" /> Passenger Photo (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    {!isCameraActive ? (
                      <button
                        type="button"
                        onClick={startCamera}
                        className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 hover:bg-emerald-500/20 transition cursor-pointer"
                      >
                        Use Webcam
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={captureSnapshot}
                        className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold transition cursor-pointer"
                      >
                        Capture
                      </button>
                    )}
                    {liveImage && (
                      <button type="button" onClick={() => setLiveImage(null)} className="text-[10px] text-rose-400 hover:underline cursor-pointer">Remove</button>
                    )}
                  </div>
                </div>

                <div
                  className="relative min-h-[150px] rounded-xl border-2 border-dashed border-white/15 bg-slate-900/30 flex items-center justify-center overflow-hidden hover:border-emerald-400/30 hover:bg-slate-900/50 transition-all cursor-pointer group"
                  onClick={() => !liveImage && !isCameraActive && faceInputRef.current?.click()}
                >
                  {isCameraActive ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <video ref={videoRef} autoPlay playsInline className="h-[140px] w-full object-cover rounded" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); stopCamera(); }}
                        className="absolute top-2 right-2 px-2 py-0.5 bg-slate-950/80 text-rose-400 text-[9px] rounded font-mono"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : liveImage ? (
                    <img src={liveImage} alt="Passenger Photo" className="max-h-[140px] w-auto object-contain rounded" />
                  ) : (
                    <div className="text-center p-3">
                      <Camera className="w-7 h-7 mx-auto mb-1 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      <span className="text-xs font-medium text-slate-300">Click to upload photo or use webcam above</span>
                      <span className="block text-[10px] text-slate-500 mt-0.5">Biometric matching skipped if no photo provided</span>
                    </div>
                  )}
                  <input type="file" ref={faceInputRef} onChange={handleFaceUpload} accept="image/*" className="hidden" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={step === 0 ? onClose : handleBack}
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-slate-300 transition cursor-pointer"
          >
            {step === 0 ? 'Cancel' : '← Back'}
          </button>

          {step < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Registering &amp; Screening...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Register &amp; Run AI Screening</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
