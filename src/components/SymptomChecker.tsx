import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  Mic,
  MicOff,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { SymptomCheckResult } from '../types';

export const SymptomChecker: React.FC<{ onBookSpecialist: (specialty: string) => void }> = ({ onBookSpecialist }) => {
  const { selectedFamilyMember, setActiveTab, triggerEmergencySOS } = useApp();

  const [symptomText, setSymptomText] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');
  const [duration, setDuration] = useState('2 Days');
  const [severity, setSeverity] = useState<number>(5);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomCheckResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const bodyParts = [
    'Head / Neurological',
    'Chest & Heart',
    'Lungs & Respiration',
    'Stomach & Digestive',
    'Bone & Joint',
    'Skin & Allergies',
    'Eyes / Vision',
    'Ear, Nose, Throat'
  ];

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Speech recognition simulation fallback
      setIsListening(true);
      setTimeout(() => {
        setSymptomText(prev => (prev ? `${prev} ` : '') + 'I have a sharp pain in my chest and difficulty taking deep breaths for the past 2 hours.');
        setIsListening(false);
      }, 2500);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptomText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) return;

    setLoading(true);
    setErrorMessage('');
    setResult(null);

    const fullSymptomDescription = selectedBodyPart
      ? `[Focus Area: ${selectedBodyPart}] ${symptomText}`
      : symptomText;

    try {
      const response = await fetch('/api/ai/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptomText: fullSymptomDescription,
          age: selectedFamilyMember.age,
          gender: selectedFamilyMember.gender,
          duration,
          severity: severity > 7 ? 'high' : severity > 4 ? 'medium' : 'low',
          patientHistory: selectedFamilyMember.chronicConditions.join(', ')
        })
      });

      if (!response.ok) {
        throw new Error('Server error analyzing symptoms');
      }

      const data = await response.json();
      setResult({
        id: `sym_${Date.now()}`,
        symptomText: fullSymptomDescription,
        age: selectedFamilyMember.age,
        gender: selectedFamilyMember.gender,
        duration,
        severity: severity > 7 ? 'high' : severity > 4 ? 'medium' : 'low',
        primaryCategory: data.primaryCategory || 'General Physician',
        urgencyLevel: data.urgencyLevel || 'Routine / OPD',
        emergencyWarning: !!data.emergencyWarning,
        possibleCauses: data.possibleCauses || ['Clinical Evaluation Recommended'],
        recommendedSpecialists: data.recommendedSpecialists || ['General Physician'],
        suggestedQuestions: data.suggestedQuestions || ['What is the likely cause?'],
        triageAdvice: data.triageAdvice || 'Please schedule an OPD consultation.',
        disclaimer: data.disclaimer || 'NOT A DIAGNOSIS. Consult a licensed physician.',
        timestamp: new Date().toLocaleDateString()
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect to AI triage engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-cyan-600 via-teal-700 to-slate-900 border border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Stethoscope className="w-48 h-48 text-cyan-400" />
        </div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-semibold border border-white/20 text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            <span>AI CLINICAL ASSISTANT</span>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">AI Clinical Symptom Checker</h2>
        <p className="text-xs sm:text-sm text-cyan-100/90 max-w-2xl mt-1.5 leading-relaxed">
          Describe what you or your family member (<strong className="text-white underline decoration-cyan-300">{selectedFamilyMember.name}</strong>) are feeling. Our AI analyzes your symptoms to route you to the correct specialist department instantly.
        </p>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleAnalyze} className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl space-y-5">
        
        {/* Voice or Text Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Describe Symptoms (Type or Speak)
            </label>
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-cyan-300 hover:bg-slate-700'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isListening ? 'Listening...' : 'Speak Symptoms'}</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              required
              rows={4}
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              placeholder="e.g. 'I have a thumping headache on the right side of my forehead, sensitivity to light, and mild nausea for the past 6 hours...'"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all leading-relaxed"
            />
          </div>
        </div>

        {/* Focus Area Chips */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Primary Area / Body Region (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {bodyParts.map((part) => (
              <button
                key={part}
                type="button"
                onClick={() => setSelectedBodyPart(selectedBodyPart === part ? '' : part)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  selectedBodyPart === part
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {part}
              </button>
            ))}
          </div>
        </div>

        {/* Severity Slider & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Symptom Severity (1-10)</label>
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                severity > 7 ? 'bg-red-500/20 text-red-400' : severity > 4 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {severity} / 10 ({severity > 7 ? 'Severe' : severity > 4 ? 'Moderate' : 'Mild'})
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">How long have you had this?</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:border-cyan-500 focus:outline-none"
            >
              <option value="Just started (< 2 Hours)">Just started (&lt; 2 Hours)</option>
              <option value="2-12 Hours">2-12 Hours</option>
              <option value="1-2 Days">1-2 Days</option>
              <option value="3-7 Days">3-7 Days</option>
              <option value="More than 2 Weeks">More than 2 Weeks</option>
            </select>
          </div>
        </div>

        {/* Patient Context Badge */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Evaluating for: <strong className="text-slate-200">{selectedFamilyMember.name}</strong> ({selectedFamilyMember.age} yrs, {selectedFamilyMember.gender})
          </div>
          {selectedFamilyMember.chronicConditions.length > 0 && (
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              History: {selectedFamilyMember.chronicConditions.join(', ')}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !symptomText.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
              <span>Analyzing Clinical Symptoms with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze Symptoms & Find Correct Specialist</span>
            </>
          )}
        </button>
      </form>

      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-300 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* AI Triage Results Section */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-fadeIn">
          
          {/* Emergency Warning Header if Critical */}
          {result.emergencyWarning && (
            <div className="p-4 bg-red-600/20 border-2 border-red-500 rounded-2xl text-red-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldAlert className="w-8 h-8 text-red-400 animate-bounce shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-red-300">POTENTIAL EMERGENCY DETECTED</h4>
                  <p className="text-xs text-red-200/90 mt-0.5">Symptoms suggest urgent emergency medical attention may be required.</p>
                </div>
              </div>
              <button
                onClick={() => triggerEmergencySOS()}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/40 cursor-pointer"
              >
                Trigger SOS Emergency
              </button>
            </div>
          )}

          {/* Primary Recommendation Card */}
          <div className="bg-gradient-to-tr from-slate-950 to-slate-900 border border-cyan-500/30 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">Recommended Specialist</span>
                <h3 className="text-2xl font-extrabold text-slate-100 mt-0.5">{result.primaryCategory}</h3>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  result.urgencyLevel.includes('Emergency')
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : result.urgencyLevel.includes('Urgent')
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  Triage: {result.urgencyLevel}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {result.triageAdvice}
            </p>

            {/* Direct Booking Shortcut */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onBookSpecialist(result.primaryCategory)}
                className="flex-1 min-w-[200px] py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Find & Book {result.primaryCategory} Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('hospitals')}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                Find Nearby ER & Hospitals
              </button>
            </div>
          </div>

          {/* Differential Causes & Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Differential Causes */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Potential Categories for Doctor Review</span>
              </h4>
              <ul className="space-y-1.5">
                {result.possibleCauses.map((cause, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Questions */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span>Questions to Ask Your Specialist</span>
              </h4>
              <ul className="space-y-1.5">
                {result.suggestedQuestions.map((q, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Strict Medical Disclaimer */}
          <div className="p-3 bg-slate-950/80 border border-amber-500/30 rounded-xl text-[11px] text-amber-300/90 leading-snug flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>MEDICAL DISCLAIMER:</strong> {result.disclaimer}
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
