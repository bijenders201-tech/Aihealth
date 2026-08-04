import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Pill,
  Clock,
  Bell,
  CheckCircle2,
  AlertCircle,
  Plus,
  Volume2,
  Calendar,
  X,
  Sparkles
} from 'lucide-react';

export const MedicineReminders: React.FC = () => {
  const { medicineReminders, markMedicineTaken, addMedicineReminder, selectedFamilyMember } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [alarmPlayingId, setAlarmPlayingId] = useState<string | null>(null);

  // New Medicine Form State
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet (500mg)');
  const [frequency, setFrequency] = useState('Twice Daily');
  const [time1, setTime1] = useState('08:00 AM');
  const [time2, setTime2] = useState('08:00 PM');
  const [instructions, setInstructions] = useState<'Before Meal' | 'After Meal' | 'With Food' | 'Anytime'>('After Meal');
  const [totalPills, setTotalPills] = useState<number>(30);

  const triggerAlarmSound = (remId: string) => {
    setAlarmPlayingId(remId);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const rem = medicineReminders.find(m => m.id === remId);
      const text = `Medicine Alarm Reminder for ${selectedFamilyMember.name}. Please take ${rem?.medicineName}, dosage ${rem?.dosage}, ${rem?.instructions}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => setAlarmPlayingId(null), 4000);
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName) return;

    addMedicineReminder({
      patientId: 'usr_101',
      familyMemberId: selectedFamilyMember.id,
      medicineName: medName,
      dosage,
      frequency,
      times: [time1, time2],
      instructions,
      remainingPills: totalPills,
      totalPills,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      active: true
    });

    setShowAddModal(false);
    setMedName('');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full">
            <Pill className="w-3.5 h-3.5" />
            <span>Digital Dose Scheduler & Pill Tracker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Medicine Reminders & Alarms</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audio dose alarms, meal-relative instructions, pill stock refill warnings, and adherence streak tracking for <strong className="text-cyan-300">{selectedFamilyMember.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Medicine Schedule</span>
        </button>
      </div>

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicineReminders.map((rem) => {
          const isLowStock = rem.remainingPills <= 10;
          const isAlarming = alarmPlayingId === rem.id;

          return (
            <div
              key={rem.id}
              className={`bg-slate-900 border rounded-3xl p-5 shadow-xl transition-all ${
                isAlarming ? 'border-cyan-400 ring-2 ring-cyan-400/50 bg-slate-900/95 animate-pulse' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100">{rem.medicineName}</h3>
                    <p className="text-xs text-cyan-400 font-medium">{rem.dosage}</p>
                  </div>
                </div>

                <button
                  onClick={() => triggerAlarmSound(rem.id)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isAlarming ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-cyan-300'
                  }`}
                  title="Test Alarm Sound"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Times & Instructions */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Schedule:</span>
                  <span className="font-semibold text-slate-200">{rem.frequency}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Scheduled Alarm Times:</span>
                  <div className="flex space-x-1 font-mono">
                    {rem.times.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Instructions:</span>
                  <span className="px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 font-medium">
                    {rem.instructions}
                  </span>
                </div>
              </div>

              {/* Pill Stock Meter */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Pill Stock Inventory:</span>
                  <span className={`font-mono font-bold ${isLowStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {rem.remainingPills} / {rem.totalPills} Remaining
                  </span>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${isLowStock ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    style={{ width: `${(rem.remainingPills / rem.totalPills) * 100}%` }}
                  ></div>
                </div>

                {isLowStock && (
                  <div className="text-[10px] text-amber-300 font-bold flex items-center space-x-1 pt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Low stock! Please order pharmacy refill soon.</span>
                  </div>
                )}
              </div>

              {/* Mark Taken Button */}
              <button
                onClick={() => markMedicineTaken(rem.id)}
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Dose Taken</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 relative">
            
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-100 mb-4">Add New Medicine Reminder</h3>

            <form onSubmit={handleSaveReminder} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Medicine Name</label>
                <input
                  type="text"
                  required
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Amoxicillin 500mg"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-3 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="1 Tablet / 2 Puffs"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Instructions</label>
                  <select
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Before Meal">Before Meal</option>
                    <option value="After Meal">After Meal</option>
                    <option value="With Food">With Food</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Morning Time</label>
                  <input
                    type="text"
                    value={time1}
                    onChange={(e) => setTime1(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Evening Time</label>
                  <input
                    type="text"
                    value={time2}
                    onChange={(e) => setTime2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Total Pill Count (Inventory)</label>
                <input
                  type="number"
                  required
                  value={totalPills}
                  onChange={(e) => setTotalPills(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono rounded-xl p-3 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Save Medicine Schedule
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
