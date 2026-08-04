import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Clock,
  Home,
  Building2,
  CheckCircle2,
  Search,
  Calendar,
  Filter,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { RazorpayModal } from './RazorpayModal';

interface LabPackage {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  parametersCount: number;
  turnaroundHours: number;
  fastingRequired: boolean;
  includedTests: string[];
  popular?: boolean;
}

export const LabTestBooking: React.FC = () => {
  const { user, selectedFamilyMember, addMedicalRecord } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [collectionType, setCollectionType] = useState<'home' | 'lab'>('home');
  const [selectedSlot, setSelectedSlot] = useState('Tomorrow, 07:00 AM - 08:00 AM');

  // Razorpay Checkout Trigger
  const [payingPackage, setPayingPackage] = useState<LabPackage | null>(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  const labPackages: LabPackage[] = [
    {
      id: 'lab_1',
      title: 'Full Body Executive Health Checkup',
      category: 'Full Body',
      price: 1499,
      originalPrice: 3499,
      parametersCount: 85,
      turnaroundHours: 24,
      fastingRequired: true,
      includedTests: ['CBC Blood Count', 'Lipid Profile', 'HbA1c Sugar', 'Kidney Function Test', 'Liver Function Test', 'Thyroid TSH'],
      popular: true
    },
    {
      id: 'lab_2',
      title: 'Complete Blood Count (CBC) with ESR',
      category: 'Blood',
      price: 299,
      originalPrice: 599,
      parametersCount: 24,
      turnaroundHours: 12,
      fastingRequired: false,
      includedTests: ['Hemoglobin', 'RBC & WBC Count', 'Platelets', 'Hematocrit', 'MCV / MCH']
    },
    {
      id: 'lab_3',
      title: 'Lipid Profile & Cardiac Risk Assessment',
      category: 'Cardiac',
      price: 599,
      originalPrice: 1299,
      parametersCount: 8,
      turnaroundHours: 12,
      fastingRequired: true,
      includedTests: ['Total Cholesterol', 'HDL Cholesterol', 'LDL Cholesterol', 'Triglycerides', 'VLDL']
    },
    {
      id: 'lab_4',
      title: 'Diabetes Comprehensive Screening',
      category: 'Diabetes',
      price: 399,
      originalPrice: 899,
      parametersCount: 6,
      turnaroundHours: 8,
      fastingRequired: true,
      includedTests: ['Fasting Blood Sugar', 'Post Prandial Sugar', 'HbA1c Average Sugar', 'Average Blood Glucose']
    },
    {
      id: 'lab_5',
      title: 'Thyroid Care Panel (T3, T4, TSH)',
      category: 'Thyroid',
      price: 449,
      originalPrice: 899,
      parametersCount: 3,
      turnaroundHours: 12,
      fastingRequired: false,
      includedTests: ['Total T3', 'Total T4', 'Ultra-sensitive TSH']
    },
    {
      id: 'lab_6',
      title: 'Vitamin D3 & B12 Deficiency Test',
      category: 'Vitamins',
      price: 799,
      originalPrice: 1899,
      parametersCount: 2,
      turnaroundHours: 24,
      fastingRequired: false,
      includedTests: ['25-Hydroxy Vitamin D', 'Serum Vitamin B12']
    }
  ];

  const categories = ['All', 'Full Body', 'Blood', 'Cardiac', 'Diabetes', 'Thyroid', 'Vitamins'];

  const filteredPackages = labPackages.filter(pkg => {
    const matchesCategory = selectedCategory === 'All' || pkg.category === selectedCategory;
    const matchesQuery = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || pkg.includedTests.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handlePaymentSuccess = (paymentDetails: { paymentId: string }) => {
    if (!payingPackage) return;

    // Automatically add lab booking to Medical Vault
    addMedicalRecord({
      patientId: user.id,
      familyMemberId: selectedFamilyMember.id,
      title: `${payingPackage.title} (Lab Booking)`,
      type: 'Blood Test',
      doctorName: 'NABL Certified Phlebotomist',
      hospitalName: collectionType === 'home' ? 'At-Home Phlebotomist Sample Collection' : 'Central Diagnostic Lab',
      date: new Date().toISOString().split('T')[0],
      rawText: `Sample collection slot: ${selectedSlot}. Transaction ID: ${paymentDetails.paymentId}. Fasting required: ${payingPackage.fastingRequired ? 'Yes (10-12 hrs)' : 'No'}.`,
      tags: ['Lab Test', payingPackage.category, 'Paid']
    });

    setBookingSuccessMsg(`Sample collection booked for ${selectedFamilyMember.name} on ${selectedSlot}! Transaction ID: ${paymentDetails.paymentId}`);
    setPayingPackage(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full">
            <FileText className="w-3.5 h-3.5" />
            <span>NABL & CAP Accredited Diagnostic Network</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Diagnostic Lab Tests & Home Sample Collection</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Book certified phlebotomists for home sample pickup with 100% digital NABL reports.</p>
        </div>

        {/* Home vs Lab Toggle */}
        <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 shrink-0">
          <button
            onClick={() => setCollectionType('home')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              collectionType === 'home' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home Pickup</span>
          </button>

          <button
            onClick={() => setCollectionType('lab')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              collectionType === 'lab' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Lab Center Visit</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {bookingSuccessMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-emerald-300 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{bookingSuccessMsg}</span>
          </div>
          <button onClick={() => setBookingSuccessMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Search & Categories Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lab tests e.g. 'CBC', 'Lipid', 'Full Body', 'Thyroid'..."
            className="w-full bg-[#1E293B] border border-slate-700/50 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-[#1E293B] text-slate-300 hover:bg-slate-800 border border-slate-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lab Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-[#1E293B] border border-slate-700/50 hover:border-cyan-500/50 rounded-[2rem] p-6 shadow-xl flex flex-col justify-between transition-all group relative"
          >
            {pkg.popular && (
              <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Popular Checkup
              </span>
            )}

            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{pkg.category} Panel</span>
              <h3 className="font-extrabold text-base text-white mt-1 group-hover:text-cyan-300 transition-colors">
                {pkg.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-slate-400 my-3">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" /> {pkg.parametersCount} Parameters
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> {pkg.turnaroundHours}h Report
                </span>
              </div>

              {/* Fasting Requirement */}
              <div className="mb-4">
                {pkg.fastingRequired ? (
                  <span className="text-[11px] text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 inline-block font-semibold">
                    ⚠️ Fasting Required (10-12 hours)
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 inline-block font-semibold">
                    ✓ No Fasting Required
                  </span>
                )}
              </div>

              {/* Tests Included List */}
              <div className="space-y-1.5 border-t border-slate-700/50 pt-3 mb-4">
                <p className="text-[11px] font-bold text-slate-300 uppercase">Key Tests Included:</p>
                {pkg.includedTests.slice(0, 4).map((test, idx) => (
                  <p key={idx} className="text-xs text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{test}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-700/50 pt-4 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-white">₹{pkg.price}</span>
                  <span className="text-xs text-slate-500 line-through">₹{pkg.originalPrice}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">
                  Save {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}%
                </span>
              </div>

              <button
                onClick={() => setPayingPackage(pkg)}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-1 cursor-pointer transition-all"
              >
                <span>Book Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Razorpay Payment Modal Integration */}
      {payingPackage && (
        <RazorpayModal
          amount={payingPackage.price}
          title={payingPackage.title}
          description={`Diagnostic Lab Test for ${selectedFamilyMember.name} • Slot: ${selectedSlot}`}
          customerName={user.name}
          customerPhone={user.phone}
          customerEmail={user.email}
          onSuccess={handlePaymentSuccess}
          onClose={() => setPayingPackage(null)}
        />
      )}

    </div>
  );
};
