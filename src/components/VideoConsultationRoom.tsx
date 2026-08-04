import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  FileText,
  Download,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'Doctor' | 'Patient';
  text: string;
  timestamp: string;
}

export const VideoConsultationRoom: React.FC<{ appointmentId?: string; onClose: () => void }> = ({
  appointmentId,
  onClose
}) => {
  const { user, selectedFamilyMember, appointments } = useApp();

  const activeAppt = appointments.find(a => a.id === appointmentId) || {
    doctorName: 'Dr. Sarah Smith, MD',
    specialty: 'Cardiology Specialist',
    hospitalName: 'Apex General Hospital Teleconsult Center',
    consultationFee: 50
  };

  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'Doctor',
      text: `Hello ${user.name}! I am reviewing ${selectedFamilyMember.name}'s medical records right now. How are you feeling today?`,
      timestamp: '10:00 AM'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [rxGenerated, setRxGenerated] = useState(true);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Patient',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Doctor AI auto-reply simulation
    setTimeout(() => {
      const docMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'Doctor',
        text: `Understood. I have logged these symptoms and prescribed medication accordingly. Please take the tablets after meals.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, docMsg]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-2 sm:p-6">
      <div className="bg-slate-900 border border-slate-700/80 rounded-[2.5rem] w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Call Top Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <h3 className="font-extrabold text-sm text-white">{activeAppt.doctorName}</h3>
              <p className="text-[11px] text-slate-400">{activeAppt.specialty} • Encrypted Teleconsultation</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              HD 1080p WebRTC
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all cursor-pointer"
              title="End Consultation Call"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Call Main View Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Main Video Screen Area (Col Span 8) */}
          <div className="lg:col-span-8 bg-slate-950 relative p-4 flex items-center justify-center flex-col overflow-hidden">
            
            {/* Simulated Doctor Video Stream */}
            <div className="w-full h-full rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden flex items-center justify-center">
              
              <div className="text-center space-y-3 z-10">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-500 p-1 mx-auto shadow-2xl shadow-cyan-500/30">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
                    alt="Doctor"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-white">{activeAppt.doctorName}</h4>
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Audio Stream Active (Speaking)</span>
                  </div>
                </div>
              </div>

              {/* Local Patient Self-Preview Box */}
              <div className="absolute bottom-4 right-4 w-36 h-48 rounded-2xl bg-slate-950 border-2 border-cyan-500/50 shadow-2xl overflow-hidden flex items-center justify-center">
                {cameraOff ? (
                  <div className="text-center">
                    <VideoOff className="w-8 h-8 text-slate-500 mx-auto" />
                    <span className="text-[10px] text-slate-500 block mt-1">Camera Off</span>
                  </div>
                ) : (
                  <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-400">{user.name}</span>
                    <span className="absolute bottom-2 left-2 text-[10px] bg-slate-950/80 px-2 py-0.5 rounded text-white">You</span>
                  </div>
                )}
              </div>

            </div>

            {/* Video Action Controls Bar */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-full border border-slate-700/80 flex items-center space-x-4 shadow-2xl z-20">
              <button
                onClick={() => setMicMuted(!micMuted)}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  micMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title="Mute / Unmute Microphone"
              >
                {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setCameraOff(!cameraOff)}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  cameraOff ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title="Turn Camera On / Off"
              >
                {cameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  showChat ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title="Toggle In-Call Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              <button
                onClick={onClose}
                className="p-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                title="End Consultation"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* In-Call Chat & Prescription Panel (Col Span 4) */}
          {showChat && (
            <div className="lg:col-span-4 bg-slate-900 border-l border-slate-800 flex flex-col justify-between p-4 overflow-hidden">
              
              <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
                <h4 className="font-extrabold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" /> In-Call Consultation Chat
                </h4>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-2xl max-w-[85%] ${
                        msg.sender === 'Patient'
                          ? 'bg-cyan-500 text-slate-950 ml-auto font-medium'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/50'
                      }`}
                    >
                      <p className="font-bold text-[10px] opacity-80 mb-0.5">{msg.sender} • {msg.timestamp}</p>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Digital Prescription Generated Card */}
                {rxGenerated && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" /> Live Digital Prescription
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full">Signed</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Rx: Paracetamol 650mg, Amoxicillin 500mg, Antacid.
                    </p>
                  </div>
                )}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message to doctor..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
