import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  X, 
  Wallet, 
  ArrowUpRight, 
  QrCode, 
  CreditCard, 
  Coins, 
  RefreshCw, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export function WalletModal({ onClose }) {
  const { lang, t } = useLang();
  const { currency, switchCurrency, formatPrice } = useCurrency();
  const { user, refreshUser } = useAuth();
  const { addToast } = useNotification();

  const [topUpAmount, setTopUpAmount] = useState(1000);
  const [selectedMethod, setSelectedMethod] = useState('SBP'); // 'SBP', 'VISA_MC', 'USDT'
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTx, setLoadingTx] = useState(true);

  const presets = [500, 1000, 2500, 5000, 10000];

  const fetchWalletData = async () => {
    try {
      setLoadingTx(true);
      const data = await api.getWallet();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTx(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleTopUp = async () => {
    if (!topUpAmount || topUpAmount <= 0) {
      addToast({
        title: 'Укажите сумму',
        message: 'Сумма пополнения должна быть больше 0',
        icon: '⚠️',
        type: 'warning'
      });
      return;
    }

    try {
      setLoading(true);
      const res = await api.topUpWallet({
        amountRub: topUpAmount,
        paymentMethod: selectedMethod
      });

      addToast({
        title: 'Баланс пополнен!',
        message: res.message,
        icon: '💰',
        type: 'success'
      });

      await refreshUser();
      await fetchWalletData();
    } catch (err) {
      addToast({
        title: 'Ошибка',
        message: err.message,
        icon: '❌',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCurrency = async () => {
    const newCurr = currency === 'RUB' ? 'USD' : 'RUB';
    switchCurrency(newCurr);
    try {
      await api.switchCurrency(newCurr);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-xl rounded-3xl bg-theme-surface border border-theme-border shadow-2xl text-theme-text overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-theme-border flex items-center justify-between bg-theme-card/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-md">
              <Wallet size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">{t('walletTitle')}</h3>
              <p className="text-xs text-theme-muted">Управление средствами и валютой</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-card transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
          
          {/* Balance Card with Currency Switcher */}
          <div className="relative p-6 rounded-3xl bg-gradient-to-br from-theme-card via-theme-surface to-theme-card border border-theme-border overflow-hidden shadow-lg flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">{t('currentBalance')}</span>
                <h2 className="text-3xl font-black text-emerald-400 mt-1">
                  {formatPrice(user?.walletBalance || 0)}
                </h2>
                <p className="text-xs text-theme-muted mt-0.5">
                  ≈ {currency === 'RUB' ? `$${Number(((user?.walletBalance || 0) * 0.0125).toFixed(2))} USD` : `${Math.round(user?.walletBalance || 0)} ₽ RUB`}
                </p>
              </div>

              {/* In-Wallet Currency Switcher Button */}
              <button
                onClick={handleToggleCurrency}
                className="px-3 py-2 rounded-xl bg-theme-surface hover:bg-theme-primary/20 border border-theme-border text-xs font-bold text-theme-text flex items-center gap-1.5 shadow-sm transition-all"
                title="Сменить валюту магазина"
              >
                <RefreshCw size={14} className="text-theme-primary" />
                <span>Валюта: <strong className="text-theme-primary">{currency}</strong></span>
              </button>
            </div>
          </div>

          {/* Top Up Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-theme-muted tracking-wider flex items-center gap-1.5">
              <ArrowUpRight size={15} className="text-emerald-400" />
              <span>{t('topUp')}</span>
            </h4>

            {/* Presets */}
            <div className="grid grid-cols-5 gap-2">
              {presets.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setTopUpAmount(amount)}
                  className={`py-2 rounded-xl text-xs font-black transition-all ${
                    topUpAmount === amount
                      ? 'bg-emerald-500 text-white shadow-md scale-105'
                      : 'bg-theme-card hover:bg-theme-border text-theme-text border border-theme-border'
                  }`}
                >
                  +{amount} ₽
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div>
              <label className="text-[11px] text-theme-muted font-bold block mb-1">Сумма пополнения (в рублях):</label>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
                className="w-full p-3 rounded-2xl bg-theme-card border border-theme-border text-sm font-bold text-theme-text focus:outline-none focus:border-emerald-500"
                min="50"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedMethod('SBP')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                  selectedMethod === 'SBP'
                    ? 'bg-theme-primary/15 border-theme-primary text-theme-primary shadow-glow-primary'
                    : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
                }`}
              >
                <QrCode size={20} />
                <span>СБП QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('VISA_MC')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                  selectedMethod === 'VISA_MC'
                    ? 'bg-theme-primary/15 border-theme-primary text-theme-primary shadow-glow-primary'
                    : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
                }`}
              >
                <CreditCard size={20} />
                <span>Карта VISA/Mastercard</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('USDT')}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                  selectedMethod === 'USDT'
                    ? 'bg-theme-primary/15 border-theme-primary text-theme-primary shadow-glow-primary'
                    : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
                }`}
              >
                <Coins size={20} />
                <span>USDT TRC20</span>
              </button>
            </div>

            <button
              onClick={handleTopUp}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Пополнение...' : `Пополнить на ${topUpAmount} ₽`}
            </button>
          </div>

          {/* Transaction History */}
          <div className="space-y-3 pt-4 border-t border-theme-border">
            <h4 className="text-xs font-black uppercase text-theme-muted tracking-wider flex items-center gap-1.5">
              <Clock size={15} />
              <span>{t('history')}</span>
            </h4>

            {loadingTx ? (
              <p className="text-xs text-theme-muted">Загрузка транзакций...</p>
            ) : transactions.length === 0 ? (
              <p className="text-xs text-theme-muted italic">{t('noTransactions')}</p>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-2.5 rounded-xl bg-theme-card border border-theme-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        tx.type === 'TOPUP' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {tx.type === 'TOPUP' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-bold text-theme-text">
                          {tx.type === 'TOPUP' ? 'Пополнение баланса' : 'Покупка игр'}
                        </p>
                        <p className="text-[10px] text-theme-muted">{tx.paymentMethod} • {tx.createdAt}</p>
                      </div>
                    </div>
                    <span className={`font-black ${tx.type === 'TOPUP' ? 'text-emerald-400' : 'text-theme-text'}`}>
                      {tx.type === 'TOPUP' ? `+${Math.round(tx.amountRub)} ₽` : `-${Math.round(tx.amountRub)} ₽`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
