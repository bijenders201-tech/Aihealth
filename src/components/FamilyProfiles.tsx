import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Plus, UserCheck, Heart, ShieldAlert, X, Sparkles } from 'lucide-react';
import { FamilyMember } from '../types';

export const FamilyProfiles: React.FC = () => {
  const { familyMembers, selectedFamilyMember, setSelectedFamilyMember, addFamilyMember } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<'Spouse' | 'Child' | 'Parent' | 'Sibling' | 'Other'>('Spouse');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [chronicConditions, setChronicConditions] = useState('Asthma');
  const [allergies, setAllergies] = useState('Penicillin');

  const handleSaveFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addFamilyMember({
      name,
      relationship,
      age,
      gender,
      bloodGroup,
      chronicConditions: chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
      allergies: allergies.split(',').map(s => s.trim()).filter(Boolean)
    });

    setShowAddModal(false);
    setName('');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full">
            <Users className="w-3.5 h-3.5" />
            <span>Multi-Profile Household Management</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Family Health Profiles</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Switch active profile to book appointments, track prescriptions, and run AI symptom checks for family members.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map((member) => {
          const isSelected = selectedFamilyMember.id === member.id;

          return (
            <div
              key={member.id}
              onClick={() => setSelectedFamilyMember(member)}
              className={`bg-slate-900 border rounded-3xl p-5 shadow-xl transition-all cursor-pointer relative overflow-hidden ${
                isSelected ? 'border-cyan-500 ring-2 ring-cyan-500/40 bg-slate-900/90' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-[10px] uppercase">
                  Active
                </span>
              )}

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 text-slate-950 font-extrabold text-lg flex items-center justify-center shrink-0">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100">{member.name}</h3>
                  <p className="text-xs text-cyan-400 font-semibold">{member.relationship} • {member.age} Yrs ({member.gender})</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Blood Group:</span>
                  <span className="font-mono font-bold text-red-400">{member.bloodGroup}</span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Chronic Conditions:</span>
                  <div className="flex flex-wrap gap-1">
                    {member.chronicConditions.map(c => (
                      <span key={c} className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300">
                        {c}
                      </span>
                    ))}
                    {member.chronicConditions.length === 0 && <span className="text-[10px] text-slate-500">None</span>}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Allergies:</span>
                  <div className="flex flex-wrap gap-1">
                    {member.allergies.map(a => (
                      <span key={a} className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded text-[10px]">
                        {a}
                      </span>
                    ))}
                    {member.allergies.length === 0 && <span className="text-[10px] text-slate-500">None</span>}
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFamilyMember(member);
                }}
                className={`w-full mt-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isSelected ? 'Active Selected Profile' : 'Switch to Profile'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 relative">
            
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-100 mb-4">Add Family Profile</h3>

            <form onSubmit={handleSaveFamilyMember} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-3 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    placeholder="e.g. B+"
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono rounded-xl p-2.5 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Chronic Conditions (Comma separated)</label>
                <input
                  type="text"
                  value={chronicConditions}
                  onChange={(e) => setChronicConditions(e.target.value)}
                  placeholder="e.g. Hypertension, Type 2 Diabetes"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-3 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Known Allergies (Comma separated)</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Peanuts, Sulfa drugs"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-3 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Save Profile
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
