import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AIChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { appLanguage } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: appLanguage === 'hi' 
        ? 'नमस्ते! मैं मेडीरूट 24x7 एआई स्वास्थ्य सहायक हूँ। आप मुझसे लक्षणों, दवाओं या अस्पताल के बारे में कुछ भी पूछ सकते हैं।'
        : 'Hello! I am your 24x7 MediRoute AI Health Assistant. Ask me anything about symptoms, medicines, OPD queue status, or emergency care.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentQuery = input;
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/symptom-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptomText: currentQuery,
          age: 32,
          gender: 'Male',
          language: appLanguage
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `${data.triageAdvice || 'Please share your details.'}\n\nPrimary Category: ${data.primaryCategory || 'General Guidance'}\nEmergency Warning: ${data.emergencyWarning ? 'CRITICAL - Seek Immediate ER' : 'Standard Routine Care'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('API error');
      }
    } catch {
      // Fallback response
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: appLanguage === 'hi'
          ? `आपके प्रश्न "${currentQuery}" के आधार पर, यह महत्वपूर्ण है कि आप नजदीकी अस्पताल के डॉक्टर से परामर्श लें। यदि लक्षण गंभीर हैं, तो तुरंत 108 डायल करें या हमारी लाइव एम्बुलेंस सेवा का उपयोग करें।`
          : `Based on your query regarding "${currentQuery}", please consult an OPD specialist or doctor. If symptoms are severe, trigger Emergency SOS or request a Live Ambulance immediately.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = appLanguage === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-40 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black p-3.5 rounded-full shadow-2xl shadow-cyan-500/40 flex items-center space-x-2 transition-all transform hover:scale-110 cursor-pointer border-2 border-white/20"
        >
          <Bot className="w-6 h-6 animate-bounce" />
          <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-wider pr-1">24x7 AI Health Bot</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 sm:bottom-20 right-2 sm:right-6 z-50 w-[94vw] sm:w-[420px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[82vh] animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                  <span>MediRoute AI Health Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-cyan-400 font-mono">24x7 Clinical Gemini Triaging</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-950/90 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white font-medium rounded-br-none shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {msg.sender === 'ai' && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{msg.time}</span>
                      <button
                        onClick={() => speakText(msg.text)}
                        className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center space-x-1"
                        title="Read Aloud"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-cyan-400 text-xs bg-slate-900/60 p-3 rounded-2xl border border-slate-800 w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI is analyzing medical symptoms...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={appLanguage === 'hi' ? 'स्वास्थ्य प्रश्न या लक्षण लिखें...' : 'Type symptoms, medicine or health question...'}
              className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl px-3 py-2.5 focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
