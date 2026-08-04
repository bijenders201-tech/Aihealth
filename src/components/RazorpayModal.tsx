import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  Building,
  Wallet,
  ArrowRight,
  Download,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface RazorpayModalProps {
  amount: number; // in INR ₹
  title: string;
  description: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  onSuccess: (paymentDetails: { paymentId: string; method: string; timestamp: string }) => void;
  onClose: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  amount,
  title,
  description,
  customerName,
  customerPhone,
  customerEmail,
  onSuccess,
  onClose
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [upiOption, setUpiOption] = useState<'gpay' | 'phonepe' | 'paytm' | 'vpa'>('gpay');
  const [vpaInput, setVpaInput] = useState('');
  
  // Card form
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8812');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardName, setCardName] = useState(customerName || 'Alex Johnson');

  // State flags
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [copiedTxn, setCopiedTxn] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedTxnId = 'pay_RzP' + Math.random().toString(36).substring(2, 11).toUpperCase();
      setTransactionId(generatedTxnId);
      setIsProcessing(false);
      setPaymentSuccess(true);

      onSuccess({
        paymentId: generatedTxnId,
        method: paymentMethod.toUpperCase(),
        timestamp: new Date().toISOString()
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transactionId);
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative text-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Razorpay Brand Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-blue-200 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 mb-2">
            <span className="font-extrabold text-lg tracking-wider text-white flex items-center gap-1.5">
              Razorpay <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-black uppercase">TEST MODE</span>
            </span>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-blue-100/80 font-medium">{title}</p>
              <p className="text-[11px] text-blue-200/70 truncate max-w-[240px]">{description}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-white">₹{amount.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-blue-200 block uppercase font-mono">INR Total</span>
            </div>
          </div>
        </div>

        {/* Payment Processing Spinner State */}
        {isProcessing ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Processing Razorpay Payment...</h3>
              <p className="text-xs text-slate-400 mt-1">Communicating securely with bank servers</p>
            </div>
            <div className="inline-flex items-center space-x-1 text-[11px] text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              <Lock className="w-3 h-3" />
              <span>256-Bit SSL Encrypted Transaction</span>
            </div>
          </div>
        ) : paymentSuccess ? (
          /* Payment Success State */
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Payment Successful</span>
              <h3 className="text-2xl font-extrabold text-white mt-1">₹{amount.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-slate-300 mt-1">{title}</p>
            </div>

            {/* Receipt Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Transaction ID:</span>
                <button
                  onClick={copyToClipboard}
                  className="font-mono text-cyan-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{transactionId}</span>
                  {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Customer:</span>
                <span className="text-slate-200 font-medium">{customerName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Method:</span>
                <span className="text-slate-200 font-medium uppercase">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Date & Time:</span>
                <span className="text-slate-200 font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Payment Selection Form */
          <div className="p-5 space-y-5">
            
            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  paymentMethod === 'upi' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  paymentMethod === 'card' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  paymentMethod === 'netbanking' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>NetBank</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`py-2 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  paymentMethod === 'wallet' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Wallet</span>
              </button>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              
              {/* UPI Options */}
              {paymentMethod === 'upi' && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-300">Select Instant UPI App</p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'gpay', name: 'Google Pay', icon: '🟢' },
                      { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                      { id: 'paytm', name: 'Paytm', icon: '🔵' }
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setUpiOption(app.id as any)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                          upiOption === app.id
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-base">{app.icon}</span>
                        <span>{app.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="text-[11px] text-slate-400 block mb-1">Or Enter UPI ID (VPA)</label>
                    <input
                      type="text"
                      placeholder="e.g. mobileNumber@upi / username@okaxis"
                      value={vpaInput}
                      onChange={(e) => setVpaInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-600"
                    />
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Valid Thru (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>
              )}

              {/* NetBanking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-300">Select Popular Indian Bank</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 rounded-xl text-left text-slate-200 transition-all cursor-pointer font-medium"
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wallets */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-300">Select Wallet / PayLater</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['Airtel Money', 'Mobikwik', 'Freecharge', 'Amazon Pay', 'Simpl PayLater', 'LazyPay'].map((wallet) => (
                      <button
                        key={wallet}
                        type="button"
                        className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 rounded-xl text-left text-slate-200 transition-all cursor-pointer font-medium"
                      >
                        {wallet}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Pay Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-5 h-5 text-cyan-300" />
                <span>PAY ₹{amount.toLocaleString('en-IN')} NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500 pt-2 border-t border-slate-800">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Secured by Razorpay PCI-DSS Level 1 Compliance</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
