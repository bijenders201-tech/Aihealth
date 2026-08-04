import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Globe2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VoiceAssistantWidget: React.FC = () => {
  const { appLanguage, setAppLanguage, setActiveTab } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Web Speech API recognition instance
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = appLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recog.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          processVoiceCommand(currentTranscript);
        }
      };

      recog.onerror = () => {
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, [appLanguage]);

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech Recognition is not supported by this browser. Using text-based AI assistant instead.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setAiResponse('');
      try {
        recognition.lang = appLanguage === 'hi' ? 'hi-IN' : 'en-US';
        recognition.start();
        setIsListening(true);
        setIsOpen(true);
      } catch (err) {
        console.error('Recognition error:', err);
      }
    }
  };

  const processVoiceCommand = (cmd: string) => {
    const lower = cmd.toLowerCase();
    let responseText = '';

    if (lower.includes('hospital') || lower.includes('अस्पताल') || lower.includes('bed')) {
      setActiveTab('hospitals');
      responseText = appLanguage === 'hi' 
        ? 'नज़दीकी अस्पताल और लाइव आईसीयू बेड खोले गए हैं।' 
        : 'Navigating to Nearby Hospitals and Live ICU Bed Availability.';
    } else if (lower.includes('ambulance') || lower.includes('एम्बुलेंस') || lower.includes('108')) {
      setActiveTab('ambulance');
      responseText = appLanguage === 'hi'
        ? 'लाइव जीपीएस एम्बुलेंस डिस्पैच ट्रैकर खोल दिया गया है।'
        : 'Opening Live GPS Ambulance Dispatch and Emergency Tracker.';
    } else if (lower.includes('doctor') || lower.includes('डॉक्टर') || lower.includes('opd')) {
      setActiveTab('doctors');
      responseText = appLanguage === 'hi'
        ? 'विशेषज्ञ डॉक्टरों की सूची खोल दी गई है।'
        : 'Displaying Verified Doctors and OPD Slot Booking.';
    } else if (lower.includes('lab') || lower.includes('blood test') || lower.includes('लैब')) {
      setActiveTab('lab_tests');
      responseText = appLanguage === 'hi'
        ? 'डायग्नोस्टिक लैब टेस्ट बुकिंग खोली गई है।'
        : 'Opening Diagnostic Lab Test Booking and Home Sample Pickup.';
    } else if (lower.includes('symptom') || lower.includes('बीमारी') || lower.includes('लक्षण')) {
      setActiveTab('symptom-check');
      responseText = appLanguage === 'hi'
        ? 'एआई लक्षण जांचकर्ता चालू किया गया है।'
        : 'Launching AI Clinical Symptom Triage.';
    } else {
      responseText = appLanguage === 'hi'
        ? `प्राप्त हुआ: "${cmd}"। मैं आपकी मेडीरूट स्वास्थ्य नेविगेशन में मदद कर रहा हूँ।`
        : `Received voice command: "${cmd}". Processing MediRoute AI triage.`;
    }

    setAiResponse(responseText);

    if (voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(responseText);
      utterance.lang = appLanguage === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Mic Trigger */}
      <button
        onClick={toggleListening}
        className={`fixed bottom-20 left-4 z-40 font-bold p-3 rounded-full shadow-2xl flex items-center space-x-2 transition-all transform hover:scale-105 cursor-pointer border border-white/20 ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse shadow-red-500/50' 
            : 'bg-slate-900 border-slate-700 text-cyan-400 hover:text-white'
        }`}
        title="Voice Assistant (Hindi & English)"
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        <span className="hidden md:inline text-xs font-mono pr-1">
          {isListening ? (appLanguage === 'hi' ? 'सुन रहा हूँ...' : 'Listening...') : (appLanguage === 'hi' ? 'वॉइस सहायक' : 'Voice Assistant')}
        </span>
      </button>

      {/* Voice Assistant Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5 text-slate-100 relative">
            
            <button
              onClick={() => { setIsOpen(false); if (isListening) recognition?.stop(); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isListening ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'}`}>
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Voice AI Assistant</span>
                <h3 className="font-extrabold text-lg text-white">
                  {appLanguage === 'hi' ? 'द्विभाषी आवाज़ सहायक (हिंदी / English)' : 'Bilingual Voice Assistant'}
                </h3>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>Recognition Language:</span>
              </span>
              <button
                onClick={() => setAppLanguage(appLanguage === 'hi' ? 'en' : 'hi')}
                className="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-500/30 transition-all cursor-pointer"
              >
                {appLanguage === 'hi' ? 'हिंदी (hi-IN)' : 'English (en-US)'}
              </button>
            </div>

            {/* Live Transcript Display */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 min-h-[90px] flex flex-col justify-center items-center text-center">
              {isListening ? (
                <div className="space-y-2">
                  <div className="flex justify-center items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                      {appLanguage === 'hi' ? 'बोलिए, मैं सुन रहा हूँ...' : 'Speak now... listening...'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-100 italic">{transcript || '...'}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  {transcript ? `You said: "${transcript}"` : (appLanguage === 'hi' ? 'माइक बटन दबाएं और बोलें' : 'Press mic button and speak command')}
                </p>
              )}
            </div>

            {/* AI Response Output */}
            {aiResponse && (
              <div className="p-4 bg-cyan-950/40 border border-cyan-500/40 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-xs text-cyan-300 font-bold">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>MediRoute Voice Action</span>
                  </span>
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className="text-slate-400 hover:text-white"
                  >
                    {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{aiResponse}</p>
              </div>
            )}

            {/* Control Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={toggleListening}
                className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer ${
                  isListening ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? (appLanguage === 'hi' ? 'रोकें' : 'Stop Listening') : (appLanguage === 'hi' ? 'बोलना शुरू करें' : 'Start Speaking')}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
