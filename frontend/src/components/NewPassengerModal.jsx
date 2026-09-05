import React, { useState, useRef } from 'react';
import {
  X, UserPlus, UploadCloud, Camera, Sparkles, Shield,
  AlertTriangle, CheckCircle2, FileText, User, Calendar,
  Globe, Hash, RefreshCw, Eye, AlertOctagon, HelpCircle
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

const SCENARIOS = [
  {
    id: 'none',
    label: 'Authentic / Clean',
    desc: 'Valid ICAO check digits, intact photo forensics, clean watchlist',
    color: 'emerald',
    icon: CheckCircle2
  },
  {
    id: 'tamper_photo',
    label: 'Photo Tampering',
    desc: 'Simulates portrait edge discontinuity and compression noise (ELA trigger)',
    color: 'rose',
    icon: AlertTriangle
  },
  {
    id: 'tamper_checksum',
    label: 'Checksum Forgery',
    desc: 'Alters MRZ check digit algorithm to simulate counterfeit printing',
    color: 'amber',
    icon: AlertOctagon
  },
  {
    id: 'tamper_text',
    label: 'DOB Cross-Mismatch',
    desc: 'Printed visual zone date differs from encoded MRZ security string',
    color: 'orange',
    icon: FileText
  },
  {
    id: 'watchlist',
    label: 'Interpol Red Notice',
    desc: 'Matches transnational crime and border denial intelligence database',
    color: 'red',
    icon: Shield
  }
];

export default function NewPassengerModal({ isOpen, onClose, onPassengerCreated }) {
  const [activeMode, setActiveMode] = useState('form'); // 'form' | 'templates'
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

  // Handle Document Upload
  const handleDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setDocumentImage(event.target?.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle Face Upload
  const handleFaceUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setLiveImage(event.target?.result);
      reader.readAsDataURL(file);
    }
  };

  // Webcam live selfie capture
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
      setErrorMsg("Camera access failed. You can upload a photo file instead.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
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
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setLiveImage(canvas.toDataURL('image/jpeg', 0.92));
      stopCamera();
    }
  };

  // Pre-load quick test cases
  const applyQuickTemplate = (template) => {
    setFormData({
      ...formData,
      ...template
    });
    setActiveMode('form');
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.holder_name.trim()) {
      setErrorMsg("Please enter passenger full name.");
      return;
    }
    if (!formData.doc_number.trim()) {
      setErrorMsg("Please enter document number.");
      return;
    }

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
      if (!res.ok) {
        throw new Error(data.detail || "Failed to register new passenger.");
      }

      // Notify parent component
      onPassengerCreated(data.passenger, data.screening_result);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-4xl bg-slate-900/95 border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
        style={{
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)'
        }}
      >
        {/* Top glow accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">Register New Passenger</h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] font-bold">
                  IRL TESTING
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Create real-world test cases, upload custom documents, or capture live passenger faces
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-950/60 p-1 border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveMode('form')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeMode === 'form'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Custom Entry
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('templates')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeMode === 'templates'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Quick Templates
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6 custom-scrollbar">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Templates Mode */}
          {activeMode === 'templates' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-mono">
                Select a pre-configured template to immediately populate test fields with edge cases:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    title: 'Diplomat / Frequent Traveler',
                    holder_name: 'AMARA K. SEN',
                    doc_number: 'D90124881',
                    nationality: 'IND',
                    dob: '1987-11-20',
                    expiry: '2034-11-19',
                    sex: 'Female',
                    document_type: 'Passport',
                    tamper_scenario: 'none',
                    notes: 'Diplomatic passport holder. Clean biometrics and verified records.'
                  },
                  {
                    title: 'Photo Replacement Suspect',
                    holder_name: 'JONAS VOGEL',
                    doc_number: 'P55410982',
                    nationality: 'DEU',
                    dob: '1990-03-08',
                    expiry: '2030-03-07',
                    sex: 'Male',
                    document_type: 'Passport',
                    tamper_scenario: 'tamper_photo',
                    notes: 'Physical photo altered with cut border artifact to test ELA forensics.'
                  },
                  {
                    title: 'Counterfeit Schengen Visa',
                    holder_name: 'FARHAN AL-MANSOUR',
                    doc_number: 'V88102394',
                    nationality: 'ARE',
                    dob: '1994-09-15',
                    expiry: '2028-09-14',
                    sex: 'Male',
                    document_type: 'Visa',
                    tamper_scenario: 'tamper_checksum',
                    notes: 'Type-C Visa with corrupted check digit algorithm.'
                  },
                  {
                    title: 'Identity Concealment (DOB Fraud)',
                    holder_name: 'CLAIRE BEAUCHAMP',
                    doc_number: 'F77201948',
                    nationality: 'FRA',
                    dob: '1982-05-19',
                    expiry: '2031-05-18',
                    sex: 'Female',
                    document_type: 'Passport',
                    tamper_scenario: 'tamper_text',
                    notes: 'Visual zone shows different birth year than embedded MRZ digits.'
                  },
                  {
                    title: 'Transnational Watchlist Match',
                    holder_name: 'MARCO ALVAREZ',
                    doc_number: 'E10948291',
                    nationality: 'COL',
                    dob: '1982-11-04',
                    expiry: '2029-11-03',
                    sex: 'Male',
                    document_type: 'Passport',
                    tamper_scenario: 'watchlist',
                    notes: 'Exact match against Interpol Red Notice & global border denial ledger.'
                  }
                ].map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyQuickTemplate(tmpl)}
                    className="text-left p-4 rounded-2xl border border-white/10 bg-slate-950/40 hover:bg-slate-950/80 hover:border-cyan-400/40 hover:shadow-lg transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                        {tmpl.title}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                        {tmpl.nationality}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-cyan-400 font-bold mb-1">
                      {tmpl.holder_name}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {tmpl.notes}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Mode */}
          {activeMode === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Section 1: Document & Face Ingestion Options */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  1. Dual-Channel Media Capture (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Document Image Ingestion */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-cyan-400" /> Document Image
                        </span>
                        {documentImage && (
                          <button
                            type="button"
                            onClick={() => setDocumentImage(null)}
                            className="text-[10px] text-rose-400 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mb-3">
                        Upload custom scan/photo, or leave blank to auto-generate synthetic ICAO document.
                      </p>
                    </div>

                    <div className="relative min-h-[130px] rounded-xl border border-dashed border-white/15 bg-slate-900/30 flex items-center justify-center overflow-hidden">
                      {documentImage ? (
                        <img
                          src={documentImage}
                          alt="Custom Document"
                          className="max-h-[120px] w-auto object-contain rounded"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => docInputRef.current?.click()}
                          className="text-center p-3 hover:text-cyan-300 transition-colors cursor-pointer"
                        >
                          <UploadCloud className="w-7 h-7 mx-auto mb-1 text-slate-500" />
                          <span className="text-xs font-medium text-slate-300">Click to Upload Document Scan</span>
                          <span className="block text-[10px] text-slate-500">JPG, PNG, WebP up to 10MB</span>
                        </button>
                      )}
                      <input
                        type="file"
                        ref={docInputRef}
                        onChange={handleDocUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Passenger Face Ingestion */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-emerald-400" /> Live Passenger Face / Photo
                        </span>
                        <div className="flex items-center gap-2">
                          {!isCameraActive ? (
                            <button
                              type="button"
                              onClick={startCamera}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 hover:bg-emerald-500/20 transition cursor-pointer"
                            >
                              Webcam
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={captureSnapshot}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-bold transition cursor-pointer"
                            >
                              Snap Photo
                            </button>
                          )}
                          {liveImage && (
                            <button
                              type="button"
                              onClick={() => setLiveImage(null)}
                              className="text-[10px] text-rose-400 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-3">
                        Embed passenger photo into the passport and perform 1:1 facial biometric matching.
                      </p>
                    </div>

                    <div className="relative min-h-[130px] rounded-xl border border-dashed border-white/15 bg-slate-900/30 flex items-center justify-center overflow-hidden">
                      {isCameraActive ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="h-[120px] w-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="absolute top-2 right-2 px-1.5 py-0.5 bg-slate-950/80 text-rose-400 text-[9px] rounded font-mono"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : liveImage ? (
                        <img
                          src={liveImage}
                          alt="Passenger Photo"
                          className="max-h-[120px] w-auto object-contain rounded"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => faceInputRef.current?.click()}
                          className="text-center p-3 hover:text-emerald-300 transition-colors cursor-pointer"
                        >
                          <Camera className="w-7 h-7 mx-auto mb-1 text-slate-500" />
                          <span className="text-xs font-medium text-slate-300">Upload Portrait Photo</span>
                          <span className="block text-[10px] text-slate-500">or click Webcam button above</span>
                        </button>
                      )}
                      <input
                        type="file"
                        ref={faceInputRef}
                        onChange={handleFaceUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Section 2: Passenger Metadata Fields */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  2. Identity & Document Attributes
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Full Legal Name (SURNAME Given Names) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. MARTINEZ CARLOS ENRIQUE"
                        value={formData.holder_name}
                        onChange={(e) => setFormData({ ...formData, holder_name: e.target.value })}
                        className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase tracking-wider font-mono focus:outline-none focus:border-cyan-400/70 focus:ring-1 focus:ring-cyan-400/30 transition"
                      />
                      <User className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Document Type */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Document Type
                    </label>
                    <select
                      value={formData.document_type}
                      onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                      className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400/70 transition"
                    >
                      <option value="Passport">Passport (TD3)</option>
                      <option value="Visa">Visa / Permit (TD2)</option>
                      <option value="ID Card">National Identity Card</option>
                    </select>
                  </div>

                  {/* Document Number */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Document Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. P98712344"
                        value={formData.doc_number}
                        onChange={(e) => setFormData({ ...formData, doc_number: e.target.value })}
                        className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase tracking-wider font-mono focus:outline-none focus:border-cyan-400/70 transition"
                      />
                      <Hash className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Nationality */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Nationality (ICAO 3-Letter Code)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={3}
                        placeholder="USA"
                        value={formData.nationality}
                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 font-bold uppercase tracking-widest font-mono focus:outline-none focus:border-cyan-400/70 transition"
                      />
                      <Globe className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Sex */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Gender / Sex
                    </label>
                    <select
                      value={formData.sex}
                      onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                      className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400/70 transition"
                    >
                      <option value="Male">Male (M)</option>
                      <option value="Female">Female (F)</option>
                      <option value="Other">Unspecified (&lt;)</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400/70 transition"
                      />
                    </div>
                  </div>

                  {/* Date of Expiry */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Date of Expiry
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.expiry}
                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                        className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400/70 transition"
                      />
                    </div>
                  </div>

                  {/* Quick Nationality Chips */}
                  <div className="sm:col-span-2 md:col-span-1 flex flex-col justify-end">
                    <span className="text-[10px] font-mono text-slate-500 mb-1.5">Quick Country:</span>
                    <div className="flex flex-wrap gap-1">
                      {COMMON_COUNTRIES.slice(0, 6).map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => setFormData({ ...formData, nationality: c.code })}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                            formData.nationality === c.code
                              ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 font-bold'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Section 3: Test Scenario / Threat Injection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    3. Threat & Verification Scenario
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">Simulate checkpoint anomaly</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {SCENARIOS.map((sc) => {
                    const isSelected = formData.tamper_scenario === sc.id;
                    const Icon = sc.icon;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, tamper_scenario: sc.id })}
                        className={`text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400/50 shadow-md ring-1 ring-cyan-400/30'
                            : 'bg-slate-950/40 border-white/10 hover:bg-slate-950/70 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                          <span className={`text-xs font-bold font-mono ${isSelected ? 'text-cyan-200' : 'text-slate-200'}`}>
                            {sc.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          {sc.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Notes */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Operator Case Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Real-world passenger testing for terminal gate 14 VIP clearance..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-400/70 transition"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-slate-300 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Registering & Running AI Screening...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Register & Run AI Screening</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
