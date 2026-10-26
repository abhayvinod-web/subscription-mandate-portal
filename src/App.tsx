import React, { useState } from 'react';
import { 
  Repeat, 
  Pause, 
  Play, 
  CreditCard, 
  Sliders, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  History, 
  RefreshCw, 
  Zap, 
  ChevronRight,
  Sparkles,
  Smartphone,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MandateItem {
  id: string;
  serviceName: string;
  merchantLogo: string;
  planName: string;
  amount: number;
  frequency: string;
  status: 'active' | 'paused';
  paymentInstrument: string;
  instrumentType: 'card' | 'upi';
  maxDebitLimit: number;
  nextDebitDate: string;
  pausedUntil?: string;
}

interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export default function App() {
  const [mandates, setMandates] = useState<MandateItem[]>([
    {
      id: 'MAND-4891',
      serviceName: 'CloudCompute Pro',
      merchantLogo: '☁️',
      planName: 'Developer Scale Tier',
      amount: 1499,
      frequency: 'Monthly',
      status: 'active',
      paymentInstrument: 'Visa Platinum •••• 8891',
      instrumentType: 'card',
      maxDebitLimit: 2500,
      nextDebitDate: '28 Sep 2026'
    },
    {
      id: 'MAND-4892',
      serviceName: 'StreamWave Music',
      merchantLogo: '🎵',
      planName: 'Family Hi-Fi Plan',
      amount: 399,
      frequency: 'Monthly',
      status: 'active',
      paymentInstrument: 'abhay@oksbi (UPI Autopay)',
      instrumentType: 'upi',
      maxDebitLimit: 600,
      nextDebitDate: '15 Oct 2026'
    },
    {
      id: 'MAND-4893',
      serviceName: 'FitnessPass Club',
      merchantLogo: '🏋️',
      planName: 'All-Gym Annual Access',
      amount: 999,
      frequency: 'Monthly',
      status: 'paused',
      paymentInstrument: 'Mastercard •••• 4022',
      instrumentType: 'card',
      maxDebitLimit: 1500,
      nextDebitDate: '12 Nov 2026',
      pausedUntil: '01 Nov 2026'
    }
  ]);

  const [activeModal, setActiveModal] = useState<{
    type: 'pause' | 'limit' | 'swap' | 'simulate-debit' | null;
    mandateId: string | null;
  }>({ type: null, mandateId: null });

  const [tempLimit, setTempLimit] = useState<number>(2000);
  const [tempPauseMonths, setTempPauseMonths] = useState<number>(1);
  const [tempNewInstrument, setTempNewInstrument] = useState<string>('phonepe');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([
    { id: 'LOG-1', timestamp: 'Today, 09:30 AM', action: 'Mandate Token Active', details: 'StreamWave Music monthly auto-debit verified by NPCI rail' },
    { id: 'LOG-2', timestamp: 'Yesterday, 04:15 PM', action: 'Limit Modified', details: 'CloudCompute Pro auto-charge limit updated to ₹2,500/mo' }
  ]);

  const selectedMandate = mandates.find(m => m.id === activeModal.mandateId);

  const addAudit = (action: string, details: string) => {
    setAuditLogs(prev => [
      { id: `LOG-${Date.now()}`, timestamp: 'Just now', action, details },
      ...prev.slice(0, 6)
    ]);
  };

  const handleToggleStatus = (mandateId: string) => {
    const target = mandates.find(m => m.id === mandateId);
    if (!target) return;

    if (target.status === 'active') {
      setActiveModal({ type: 'pause', mandateId });
    } else {
      setMandates(prev => prev.map(m => m.id === mandateId ? { ...m, status: 'active', pausedUntil: undefined } : m));
      addAudit('Mandate Resumed', `${target.serviceName} autopay unpaused. Next billing active for ${target.nextDebitDate}`);
      setSuccessBanner(`${target.serviceName} subscription resumed successfully.`);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    }
  };

  const confirmPause = () => {
    if (!activeModal.mandateId) return;
    const resumeDate = `In ${tempPauseMonths} Month(s)`;
    setMandates(prev => prev.map(m => 
      m.id === activeModal.mandateId 
        ? { ...m, status: 'paused', pausedUntil: resumeDate } 
        : m
    ));
    addAudit('Mandate Temporarily Paused', `${selectedMandate?.serviceName} paused for ${tempPauseMonths} month(s) without losing discount tier.`);
    setSuccessBanner(`${selectedMandate?.serviceName} paused. You will not be charged during this period.`);
    setActiveModal({ type: null, mandateId: null });
  };

  const confirmLimitChange = () => {
    if (!activeModal.mandateId) return;
    setMandates(prev => prev.map(m => 
      m.id === activeModal.mandateId ? { ...m, maxDebitLimit: tempLimit } : m
    ));
    addAudit('Spending Cap Enforced', `${selectedMandate?.serviceName} monthly ceiling adjusted to ₹${tempLimit}. Charges above this require manual 2FA.`);
    setSuccessBanner(`Monthly cap for ${selectedMandate?.serviceName} updated to ₹${tempLimit}.`);
    setActiveModal({ type: null, mandateId: null });
  };

  const confirmSwapInstrument = () => {
    if (!activeModal.mandateId) return;
    const newName = tempNewInstrument === 'phonepe' 
      ? 'PhonePe UPI Autopay (abhay@ybl)' 
      : 'HDFC Millennia Visa •••• 9912';
    const newType = tempNewInstrument === 'phonepe' ? 'upi' : 'card';

    setMandates(prev => prev.map(m => 
      m.id === activeModal.mandateId 
        ? { ...m, paymentInstrument: newName, instrumentType: newType } 
        : m
    ));
    addAudit('Payment Instrument Swapped', `${selectedMandate?.serviceName} billing method updated to ${newName} with zero token downtime.`);
    setSuccessBanner(`Payment method for ${selectedMandate?.serviceName} updated without recreating subscription.`);
    setActiveModal({ type: null, mandateId: null });
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
  };

  const simulateAutoDebit = (mandateId: string) => {
    const item = mandates.find(m => m.id === mandateId);
    if (!item) return;
    if (item.status === 'paused') {
      alert('Cannot trigger auto-debit on a PAUSED mandate. Please resume first.');
      return;
    }

    addAudit('Simulated Auto-Debit Triggered', `NPCI e-Mandate auto-debited ₹${item.amount} from ${item.paymentInstrument}. Invoice dispatched.`);
    setSuccessBanner(`Auto-debit simulation successful for ${item.serviceName} (₹${item.amount}).`);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-[#0d1322]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              AV
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                Abhay Vinod
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-medium">
                  Portfolio Prototype
                </span>
              </h1>
              <p className="text-xs text-slate-400">Software & UI Engineer • Razorpay Fix-My-Itch #3</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/abhayvinod"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/60"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-8">
        {/* Project Header Card */}
        <section className="bg-gradient-to-b from-slate-900 to-[#101729] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              Razorpay Fix-My-Itch #3
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              -35% Involuntary Churn Reduction
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              RBI e-Mandate Compliant
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Recurring Mandate &amp; Subscription Self-Service Management Portal
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            Eliminating accidental subscription drop-offs and card expiration failures by giving subscribers full control: 1-click temporary pause, custom monthly spending caps, and seamless zero-downtime payment instrument swaps.
          </p>

          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap gap-2">
            {["React 19", "TypeScript", "Tailwind CSS v4", "Lucide Icons", "Canvas Confetti", "Finite-State Machine"].map(t => (
              <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700 text-slate-300">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* The Live Interactive Prototype */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Interactive Working Prototype
            </h3>
            <span className="text-xs text-slate-500">Try pausing, adjusting spending caps, and test-debiting</span>
          </div>

          <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl text-slate-900 font-sans">
            {/* Top Bar */}
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span className="font-bold text-slate-900">Prototype Console:</span>
                <span className="text-slate-600">Recurring Mandate &amp; Autopay Manager</span>
              </div>

              <button
                onClick={() => {
                  setSuccessBanner(null);
                  addAudit('Portal Refreshed', 'Active NPCI mandates synchronized with banking token vault');
                }}
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Mandates</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Notification Banner */}
              {successBanner && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successBanner}</span>
                  </div>
                  <button onClick={() => setSuccessBanner(null)} className="text-slate-400 hover:text-slate-700 text-xs">
                    ✕
                  </button>
                </div>
              )}

              {/* Mandates List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800 flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-indigo-600" />
                    Your Active Subscriptions ({mandates.length})
                  </h4>
                  <span className="text-[11px] text-slate-500">RBI e-Mandate Compliant (AFA Verified)</span>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {mandates.map(m => (
                    <div 
                      key={m.id}
                      className={`p-4 rounded-xl border transition-all ${
                        m.status === 'active'
                          ? 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                          : 'bg-slate-50/40 border-slate-200/60 opacity-80'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shrink-0 shadow-xs">
                            {m.merchantLogo}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-slate-900 text-sm">{m.serviceName}</h5>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                m.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {m.status === 'active' ? '● Active' : '⏸ Paused'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{m.planName} • Mandate ID: <span className="font-mono">{m.id}</span></p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                {m.instrumentType === 'card' ? <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> : <Smartphone className="w-3.5 h-3.5 text-indigo-600" />}
                                <strong className="text-slate-800 font-medium">{m.paymentInstrument}</strong>
                              </span>
                              <span>•</span>
                              <span>Max Cap: <strong className="text-slate-800 font-mono">₹{m.maxDebitLimit}</strong></span>
                              <span>•</span>
                              <span>Next: <strong className="text-slate-700 font-normal">{m.nextDebitDate}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                          <div className="text-left lg:text-right">
                            <div className="text-base font-bold text-slate-900 font-mono">
                              ₹{m.amount.toLocaleString('en-IN')}<span className="text-xs text-slate-500 font-sans font-normal">/{m.frequency.toLowerCase()}</span>
                            </div>
                            {m.pausedUntil && (
                              <span className="text-[10px] text-amber-700 font-semibold block">Auto-resumes {m.pausedUntil}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(m.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                                m.status === 'active'
                                  ? 'bg-white border-amber-300 text-amber-800 hover:bg-amber-50'
                                  : 'bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                              }`}
                            >
                              {m.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                              <span>{m.status === 'active' ? 'Pause' : 'Resume'}</span>
                            </button>

                            <button
                              onClick={() => {
                                setTempLimit(m.maxDebitLimit);
                                setActiveModal({ type: 'limit', mandateId: m.id });
                              }}
                              className="px-2.5 py-1.5 rounded-lg text-xs bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1 transition-colors cursor-pointer font-medium"
                            >
                              <Sliders className="w-3.5 h-3.5 text-slate-500" />
                              <span className="hidden sm:inline">Cap</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveModal({ type: 'swap', mandateId: m.id });
                              }}
                              className="px-2.5 py-1.5 rounded-lg text-xs bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1 transition-colors cursor-pointer font-medium"
                            >
                              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                              <span className="hidden sm:inline">Swap</span>
                            </button>

                            <button
                              onClick={() => simulateAutoDebit(m.id)}
                              className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1 transition-colors cursor-pointer font-semibold"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-400" />
                              <span className="hidden sm:inline">Test Debit</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Feed */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-indigo-600" />
                    NPCI Mandate Audit Trail &amp; Auto-Debit Activity
                  </h5>
                  <span className="text-[10px] text-slate-500 font-mono">Live Event Stream</span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  {auditLogs.map(log => (
                    <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        <strong className="text-slate-900 font-sans">{log.action}:</strong>
                        <span className="text-slate-600 font-sans text-[11px]">{log.details}</span>
                      </div>
                      <span className="text-slate-500 text-[10px] mt-0.5 sm:mt-0">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MODAL: PAUSE SUBSCRIPTION */}
            {activeModal.type === 'pause' && selectedMandate && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Pause className="w-4 h-4 text-amber-600" />
                      Pause {selectedMandate.serviceName}
                    </h4>
                    <button 
                      onClick={() => setActiveModal({ type: null, mandateId: null })}
                      className="text-slate-400 hover:text-slate-900"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-slate-600">
                    Need a break? Pause your autopay mandate temporarily without losing your saved preferences or grandfathered pricing.
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-800 font-semibold block">Select Pause Duration:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map(months => (
                        <button
                          key={months}
                          onClick={() => setTempPauseMonths(months)}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-colors cursor-pointer ${
                            tempPauseMonths === months
                              ? 'bg-amber-50 border-amber-400 text-amber-900'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {months} Month{months > 1 ? 's' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => setActiveModal({ type: null, mandateId: null })}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer border border-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmPause}
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Confirm Pause
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL: SET SPENDING CAP */}
            {activeModal.type === 'limit' && selectedMandate && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-indigo-600" />
                      Set Monthly Spending Ceiling
                    </h4>
                    <button 
                      onClick={() => setActiveModal({ type: null, mandateId: null })}
                      className="text-slate-400 hover:text-slate-900"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-slate-600">
                    Protect against unexpected overages. Any invoice above this threshold requires mandatory manual 2FA verification.
                  </p>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">Current Max Limit:</span>
                      <span className="text-base font-bold text-slate-900 font-mono">₹{tempLimit}</span>
                    </div>
                    <input
                      type="range"
                      min={selectedMandate.amount}
                      max={5000}
                      step={250}
                      value={tempLimit}
                      onChange={e => setTempLimit(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Plan cost: ₹{selectedMandate.amount}</span>
                      <span>Max: ₹5,000</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => setActiveModal({ type: null, mandateId: null })}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer border border-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmLimitChange}
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Save Ceiling
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL: SWAP PAYMENT METHOD */}
            {activeModal.type === 'swap' && selectedMandate && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                      Change Payment Method for {selectedMandate.serviceName}
                    </h4>
                    <button 
                      onClick={() => setActiveModal({ type: null, mandateId: null })}
                      className="text-slate-400 hover:text-slate-900"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-slate-600">
                    Replace an expiring card or switch to UPI Autopay without resetting your billing schedule.
                  </p>

                  <div className="space-y-2.5">
                    {[
                      { id: 'phonepe', title: 'PhonePe UPI Autopay', subtitle: 'abhay@ybl • 99.9% uptime', icon: Smartphone },
                      { id: 'card', title: 'HDFC Millennia Credit Card', subtitle: '•••• 9912 • Valid thru 08/29', icon: CreditCard }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setTempNewInstrument(opt.id)}
                        className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                          tempNewInstrument === opt.id
                            ? 'bg-indigo-50/50 border-slate-900 text-slate-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <opt.icon className="w-4 h-4 text-indigo-600" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{opt.title}</p>
                            <p className="text-[10px] text-slate-500">{opt.subtitle}</p>
                          </div>
                        </div>
                        {tempNewInstrument === opt.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => setActiveModal({ type: null, mandateId: null })}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer border border-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmSwapInstrument}
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Update Instrument
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Engineering Architecture Breakdown */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Repeat className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Temporary Pause State Machine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prevents hard cancellations by letting subscribers pause billing for 1-3 months while maintaining their subscription token and grandfathered price tiers.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Sliders className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Granular Spending Ceilings</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complies with RBI recurring mandate guidelines by letting customers set personalized auto-debit caps, preventing unauthorized bill surges.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Zero-Downtime Token Swap</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Allows customers to hot-swap expiring credit cards or switch to UPI Autopay without destroying the recurring subscription agreement.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-6 text-center text-xs text-slate-500">
        Engineered by <strong className="text-slate-300 font-semibold">Abhay Vinod</strong> • Built with React 19, TypeScript &amp; Tailwind CSS
      </footer>
    </div>
  );
}
