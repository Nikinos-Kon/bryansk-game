import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Coins, 
  Wallet, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function CheckoutModal({ items = [], onClose, onSuccess }) {
  const { lang, t } = useLang();
  const { currency, formatPrice } = useCurrency();
  const { clearCart, refreshCart } = useCart();
  const { user, refreshUser } = useAuth();
  const { addToast } = useNotification();

  const [paymentMethod, setPaymentMethod] = useState('SBP'); // 'SBP', 'VISA_MC', 'USDT', 'WALLET'
  const [processing, setProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Card input states
  const [cardNumber, setCardNumber] = useState('4276 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('•••');
  const [cardName, setCardName] = useState(user?.nickname || 'NIKITA GAMER');

  const USDT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

  // Calculate totals
  let totalRub = 0;
  let totalUsd = 0;
  let discountRub = 0;
  let discountUsd = 0;

  items.forEach((game) => {
    const disc = game.discountPercent || 0;
    const finalRub = disc > 0 ? Math.round(game.priceRub * (1 - disc / 100)) : game.priceRub;
    const finalUsd = disc > 0 ? Number((game.priceUsd * (1 - disc / 100)).toFixed(2)) : game.priceUsd;
    totalRub += finalRub;
    totalUsd += finalUsd;
    discountRub += (game.priceRub - finalRub);
    discountUsd += (game.priceUsd - finalUsd);
  });

  const handleCopyUsdt = () => {
    navigator.clipboard.writeText(USDT_ADDRESS);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleExecutePayment = async () => {
    try {
      setProcessing(true);

      const res = await api.checkout({
        paymentMethod,
        items: items.map(g => ({ id: g.id, gameId: g.id }))
      });

      setIsSuccess(true);
      
      // Fire celebratory confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      addToast({
        title: 'Успешная покупка!',
        message: `Игры (${items.length}) добавлены в вашу библиотеку.`,
        icon: '🎉',
        type: 'success'
      });

      await refreshUser();
      await refreshCart();

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 2500);
    } catch (err) {
      addToast({
        title: 'Ошибка оплаты',
        message: err.message,
        icon: '❌',
        type: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl rounded-3xl bg-theme-surface border border-theme-border shadow-2xl text-theme-text overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-theme-border flex items-center justify-between bg-theme-card/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-theme-primary/20 text-theme-primary flex items-center justify-center font-bold">
              💳
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">{t('checkoutTitle')}</h3>
              <p className="text-xs text-theme-muted">{items.length} {items.length === 1 ? 'игра' : 'товаров'} к оплате</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-card transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-10 flex flex-col items-center justify-center text-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg border border-emerald-500/40">
              <CheckCircle2 size={44} />
            </div>
            <h3 className="text-2xl font-black text-theme-text">{t('paymentSuccess')}</h3>
            <p className="text-sm text-theme-muted max-w-sm">
              Игры теперь доступны в вашей библиотеке! Вы можете сразу начать загрузку и играть.
            </p>
            <div className="mt-4 px-6 py-2 rounded-full bg-theme-card border border-theme-border text-xs font-semibold text-theme-primary animate-pulse">
              Перенаправление в библиотеку...
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-6">
            
            {/* Items Mini List */}
            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
              {items.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-2.5 rounded-xl bg-theme-card border border-theme-border text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={game.coverImage} alt={game.title} className="w-10 h-7 object-cover rounded-md" />
                    <span className="font-bold text-theme-text">{game.title}</span>
                  </div>
                  <span className="font-extrabold text-theme-primary">
                    {formatPrice(game.priceRub, game.priceUsd)}
                  </span>
                </div>
              ))}
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-theme-muted tracking-wider">
                {t('selectPaymentMethod')}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                
                {/* SBP QR */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('SBP')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                    paymentMethod === 'SBP'
                      ? 'bg-theme-primary/15 border-theme-primary text-theme-primary font-black shadow-glow-primary scale-105'
                      : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
                  }`}
                >
                  <QrCode size={22} />
                  <span className="text-xs">СБП (QR-код)</span>
                </button>

                {/* VISA / MC */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('VISA_MC')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                    paymentMethod === 'VISA_MC'
                      ? 'bg-theme-primary/15 border-theme-primary text-theme-primary font-black shadow-glow-primary scale-105'
                      : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
                  }`}
                >
                  <CreditCard size={22} />
                  <span className="text-xs">Карта РФ/Мир</span>
                </button>

                {/* USDT Crypto */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('USDT')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                    paymentMethod === 'USDT'
                      ? 'bg-theme-primary/15 border-theme-primary text-theme-primary font-black shadow-glow-primary scale-105'
                      : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
                  }`}
                >
                  <Coins size={22} />
                  <span className="text-xs">USDT (Крипта)</span>
                </button>

                {/* Internal Wallet */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('WALLET')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                    paymentMethod === 'WALLET'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-black shadow-md scale-105'
                      : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
                  }`}
                >
                  <Wallet size={22} />
                  <span className="text-xs">Кошелёк</span>
                </button>

              </div>
            </div>

            {/* Payment Method Details / Interaction View */}
            <div className="p-4 rounded-2xl bg-theme-card border border-theme-border">
              
              {/* SBP View */}
              {paymentMethod === 'SBP' && (
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative p-2.5 rounded-2xl bg-white shadow-xl flex-shrink-0">
                    {/* Visual QR Code Generator Simulation */}
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=sbp://pay?amount=${totalRub}&recipient=BryanskGameStore`} 
                      alt="SBP QR Code"
                      className="w-32 h-32 rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-theme-primary text-white flex items-center justify-center font-black text-xs shadow-md">
                        СБП
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-center sm:text-left">
                    <h4 className="font-bold text-sm text-theme-text">Оплата через СБП без комиссии</h4>
                    <p className="text-xs text-theme-muted leading-relaxed">
                      {t('scanQrToPay')}. Поддерживаются Сбер, Т-Банк, ВТБ, Альфа-Банк и другие банки РФ.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold justify-center sm:justify-start">
                      <ShieldCheck size={14} />
                      <span>Моментальное зачисление игры на аккаунт</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Card View */}
              {paymentMethod === 'VISA_MC' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-theme-muted">
                    <span>{t('visaMastercard')}</span>
                    <div className="flex gap-1.5 font-black text-[10px] text-theme-text">
                      <span className="px-1.5 py-0.5 bg-theme-surface rounded border border-theme-border">VISA</span>
                      <span className="px-1.5 py-0.5 bg-theme-surface rounded border border-theme-border">MC</span>
                      <span className="px-1.5 py-0.5 bg-theme-surface rounded border border-theme-border">МИР</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Номер карты"
                        className="w-full p-2.5 rounded-xl bg-theme-surface border border-theme-border font-mono text-theme-text focus:outline-none focus:border-theme-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="ММ/ГГ"
                        className="p-2.5 rounded-xl bg-theme-surface border border-theme-border font-mono text-theme-text focus:outline-none focus:border-theme-primary"
                      />
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC / CVV"
                        className="p-2.5 rounded-xl bg-theme-surface border border-theme-border font-mono text-theme-text focus:outline-none focus:border-theme-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* USDT View */}
              {paymentMethod === 'USDT' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-theme-text">Tether USDT (TRC-20)</span>
                    <span className="text-theme-primary font-black">~{totalUsd} USDT</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-theme-muted truncate">{USDT_ADDRESS}</span>
                    <button
                      type="button"
                      onClick={handleCopyUsdt}
                      className="px-3 py-1.5 rounded-lg bg-theme-card hover:bg-theme-border border border-theme-border text-xs font-bold text-theme-text flex items-center gap-1 transition-all flex-shrink-0"
                    >
                      {copiedAddress ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span>{copiedAddress ? t('copied') : t('copyAddress')}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-theme-muted">
                    Сеть TRC-20 (Tron). Комиссия 1 USDT, автоматическое подтверждение через 1 блок.
                  </p>
                </div>
              )}

              {/* Wallet View */}
              {paymentMethod === 'WALLET' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-theme-muted">{t('currentBalance')}:</span>
                    <span className="font-black text-base text-emerald-400">
                      {formatPrice(user?.walletBalance || 0)}
                    </span>
                  </div>
                  {(user?.walletBalance || 0) < totalRub ? (
                    <p className="text-xs text-rose-400 font-bold bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
                      Недостаточно средств. Пополните кошелёк или выберите другой способ оплаты.
                    </p>
                  ) : (
                    <p className="text-xs text-emerald-400 font-medium">
                      Средств на балансе достаточно. Оплата произойдет мгновенно в 1 клик.
                    </p>
                  )}
                </div>
              )}

            </div>

            {/* Total Summary & Confirm Button */}
            <div className="pt-4 border-t border-theme-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-theme-muted font-medium">{t('cartTotal')}:</p>
                <p className="text-2xl font-black text-theme-primary">
                  {formatPrice(totalRub, totalUsd)}
                </p>
              </div>

              <button
                onClick={handleExecutePayment}
                disabled={processing || (paymentMethod === 'WALLET' && (user?.walletBalance || 0) < totalRub)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white text-sm font-extrabold shadow-glow-primary hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <span>Обработка транзакции...</span>
                ) : (
                  <>
                    <span>{t('completePayment')}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
