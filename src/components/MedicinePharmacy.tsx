import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Pill,
  Search,
  ShoppingCart,
  Upload,
  Camera,
  Plus,
  Minus,
  CheckCircle2,
  Truck,
  ShieldCheck,
  X,
  ArrowRight,
  Sparkles,
  Tag
} from 'lucide-react';
import { RazorpayModal } from './RazorpayModal';

interface MedicineItem {
  id: string;
  name: string;
  brand: string;
  dosage: string;
  packSize: string;
  price: number;
  originalPrice: number;
  requiresPrescription: boolean;
  category: string;
  image: string;
}

export const MedicinePharmacy: React.FC = () => {
  const { user, selectedFamilyMember, addMedicineReminder } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<{ item: MedicineItem; qty: number }[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  // Prescription Upload State
  const [rxUploaded, setRxUploaded] = useState(false);
  const [isScanningRx, setIsScanningRx] = useState(false);

  // Payment Modal Trigger
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState('');

  const medicines: MedicineItem[] = [
    {
      id: 'med_1',
      name: 'Dolo 650mg Paracetamol',
      brand: 'Micro Labs',
      dosage: '650 mg',
      packSize: '15 Tablets Strip',
      price: 32,
      originalPrice: 42,
      requiresPrescription: false,
      category: 'Fever & Pain',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'med_2',
      name: 'Amoxyclav 625mg Antibiotic',
      brand: 'Mankind Pharma',
      dosage: '625 mg',
      packSize: '10 Tablets Strip',
      price: 185,
      originalPrice: 220,
      requiresPrescription: true,
      category: 'Antibiotics',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'med_3',
      name: 'Glycomet SR 500mg (Metformin)',
      brand: 'USV Pvt Ltd',
      dosage: '500 mg',
      packSize: '20 Tablets Strip',
      price: 54,
      originalPrice: 70,
      requiresPrescription: true,
      category: 'Diabetes',
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'med_4',
      name: 'Atorva 10mg Cholesterol Care',
      brand: 'Zydus Cadila',
      dosage: '10 mg',
      packSize: '15 Tablets Strip',
      price: 98,
      originalPrice: 130,
      requiresPrescription: true,
      category: 'Cardiac',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'med_5',
      name: 'Pan-40 Gastro Relief',
      brand: 'Alkem Labs',
      dosage: '40 mg',
      packSize: '15 Tablets Strip',
      price: 142,
      originalPrice: 175,
      requiresPrescription: false,
      category: 'Gastro Care',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'med_6',
      name: 'Becosules Multi-Vitamin Capsules',
      brand: 'Pfizer Ltd',
      dosage: 'Daily Vital',
      packSize: '20 Capsules Strip',
      price: 48,
      originalPrice: 60,
      requiresPrescription: false,
      category: 'Vitamins & Wellness',
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=200'
    }
  ];

  const categories = ['All', 'Fever & Pain', 'Antibiotics', 'Diabetes', 'Cardiac', 'Gastro Care', 'Vitamins & Wellness'];

  const addToCart = (item: MedicineItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.item.id === id) {
        const newQty = i.qty + delta;
        return newQty > 0 ? { ...i, qty: newQty } : null;
      }
      return i;
    }).filter(Boolean) as { item: MedicineItem; qty: number }[]);
  };

  const cartSubtotal = cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);
  const discountAmount = couponApplied ? Math.round(cartSubtotal * 0.20) : 0;
  const deliveryFee = cartSubtotal > 300 || cartSubtotal === 0 ? 0 : 35;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  const handleSimulateRxUpload = () => {
    setIsScanningRx(true);
    setTimeout(() => {
      setIsScanningRx(false);
      setRxUploaded(true);
      // Automatically populate cart with prescribed meds
      addToCart(medicines[0]);
      addToCart(medicines[2]);
    }, 1500);
  };

  const handlePaymentSuccess = (paymentDetails: { paymentId: string }) => {
    // Add medicine reminders automatically for ordered drugs
    cart.forEach(({ item }) => {
      addMedicineReminder({
        patientId: user.id,
        familyMemberId: selectedFamilyMember.id,
        medicineName: item.name,
        dosage: item.dosage,
        frequency: '1 Tablet Daily',
        times: ['08:00 AM', '08:00 PM'],
        instructions: 'After Meal',
        remainingPills: 15,
        totalPills: 15,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        active: true
      });
    });

    setOrderSuccessMsg(`Pharmacy Order Placed Successfully! ⚡ Express 30-min Delivery to ${user.address}. Txn ID: ${paymentDetails.paymentId}`);
    setCart([]);
    setIsCheckoutOpen(false);
    setShowCartDrawer(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full">
            <Pill className="w-3.5 h-3.5" />
            <span>24x7 E-Pharmacy & Express Delivery</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Order Genuine Medicines Online</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">AI Prescription Reader, 20% discount on first order, and 30-minute door delivery.</p>
        </div>

        {/* View Cart Button */}
        <button
          onClick={() => setShowCartDrawer(true)}
          className="relative px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all cursor-pointer shrink-0"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>VIEW CART ({cart.reduce((a, c) => a + c.qty, 0)})</span>
          {cart.length > 0 && (
            <span className="bg-slate-950 text-cyan-300 font-bold px-2 py-0.5 rounded-full text-[10px]">
              ₹{grandTotal}
            </span>
          )}
        </button>
      </div>

      {/* Success Banner */}
      {orderSuccessMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-emerald-300 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{orderSuccessMsg}</span>
          </div>
          <button onClick={() => setOrderSuccessMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* AI Prescription Upload Banner Box */}
      <div className="bg-gradient-to-r from-cyan-900/40 via-slate-900 to-teal-900/40 border border-cyan-500/30 rounded-[2rem] p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Camera className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Upload Doctor Prescription</h3>
            <p className="text-xs text-cyan-200 mt-0.5">Gemini AI automatically scans drug names, dosages, and populates your cart.</p>
          </div>
        </div>

        <button
          onClick={handleSimulateRxUpload}
          disabled={isScanningRx}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 flex items-center space-x-2 transition-all cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>{isScanningRx ? 'AI Scanning Prescription...' : rxUploaded ? '✓ Prescription Verified' : 'UPLOAD PRESCRIPTION PHOTO'}</span>
        </button>
      </div>

      {/* Search & Categories */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines, salts, or brand names e.g. 'Dolo', 'Metformin'..."
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

      {/* Medicines Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicines.map((med) => (
          <div
            key={med.id}
            className="bg-[#1E293B] border border-slate-700/50 hover:border-cyan-500/50 rounded-[2rem] p-5 shadow-xl flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{med.category}</span>
                {med.requiresPrescription && (
                  <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Rx Required
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-base text-white">{med.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{med.brand} • {med.dosage}</p>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">{med.packSize}</p>
            </div>

            <div className="border-t border-slate-700/50 pt-4 mt-4 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-white">₹{med.price}</span>
                  <span className="text-xs text-slate-500 line-through">₹{med.originalPrice}</span>
                </div>
              </div>

              <button
                onClick={() => addToCart(med)}
                className="px-4 py-2 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD TO CART</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Cart Side Drawer / Modal */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
          <div className="bg-slate-900 w-full max-w-md h-full border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto">
            
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-cyan-400" /> Your Pharmacy Cart
                </h3>
                <button onClick={() => setShowCartDrawer(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Pill className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-4 my-4">
                  {cart.map(({ item, qty }) => (
                    <div key={item.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-extrabold text-white">{item.name}</h4>
                        <p className="text-slate-400 font-mono">₹{item.price} x {qty} = ₹{item.price * qty}</p>
                      </div>

                      <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-xl">
                        <button onClick={() => updateQty(item.id, -1)} className="p-1 text-slate-300 hover:text-white">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-white px-2">{qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1 text-slate-300 hover:text-white">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Coupon Promo */}
                  <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-2xl flex justify-between items-center text-xs">
                    <span className="text-cyan-300 font-bold flex items-center gap-1">
                      <Tag className="w-4 h-4" /> Use Coupon 'GET20' for 20% OFF
                    </span>
                    <button
                      onClick={() => setCouponApplied(!couponApplied)}
                      className="px-3 py-1 bg-cyan-500 text-slate-950 rounded-lg font-black text-[10px]"
                    >
                      {couponApplied ? 'APPLIED' : 'APPLY'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>₹{cartSubtotal}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount (20% OFF):</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Express Delivery Fee:</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                    <span>Grand Total:</span>
                    <span className="text-cyan-400">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold rounded-2xl text-xs shadow-xl shadow-cyan-500/20 flex items-center justify-center space-x-2 cursor-pointer transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>PROCEED TO RAZORPAY CHECKOUT (₹{grandTotal})</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Razorpay Integration Modal */}
      {isCheckoutOpen && (
        <RazorpayModal
          amount={grandTotal}
          title="MediRoute E-Pharmacy Order"
          description={`Delivery to ${user.address} for ${selectedFamilyMember.name}`}
          customerName={user.name}
          customerPhone={user.phone}
          customerEmail={user.email}
          onSuccess={handlePaymentSuccess}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}

    </div>
  );
};
