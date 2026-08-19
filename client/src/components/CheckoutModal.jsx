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
  Wallet, 
  CheckCircle2, 
  ArrowRight, 
  PlusCircle, 
  AlertCircle,
  ShieldCheck,
  Gamepad2
} from 'lucide-react';

export function CheckoutModal({ items = [], onClose, onSuccess, onOpenWallet }) {
  const { lang, t } = useLang();
  const { currency, formatPrice } = useCurrency();
  const { refreshCart } = useCart();
  const { user, refreshUser } = useAuth();
  const { addToast } = useNotification();

  const [processing, setProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const hasEnoughBalance = (user?.walletBalance || 0) >= totalRub;

  const handleExecutePayment = async () => {
    if (!hasEnoughBalance) {
      addToast({
        title: 'Недостаточно средств',
        message: 'Пополните баланс вашего кошелька для совершения покупки',
        icon: '⚠️',
        type: 'warning'
      });
      return;
    }

    try {
      setProcessing(true);

      await api.checkout({
        paymentMethod: 'WALLET',
        items: items.map(g => ({ id: g.id, gameId: g.id }))
      });

      setIsSuccess(true);
      
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
      }, 2300);
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
      
      <div className="relative w-full max-w-lg rounded-3xl bg-theme-surface border border-theme-border shadow-2xl text-theme-text overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-theme-border flex items-center justify-between bg-theme-card/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-md">
              <Wallet size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">{t('checkoutTitle')}</h3>
              <p className="text-xs text-theme-muted">Оплата с внутреннего кошелька магазина</p>
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
              Игры теперь в вашей библиотеке! Вы можете сразу приступить к загрузке и игре.
            </p>
            <div className="mt-4 px-6 py-2 rounded-full bg-theme-card border border-theme-border text-xs font-semibold text-theme-primary animate-pulse">
              Перенаправление в библиотеку...
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-5">
            
            {/* Items Mini List */}
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
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

            {/* Wallet Balance & Payment Summary Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-theme-card to-theme-surface border border-theme-border space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-theme-muted font-bold uppercase tracking-wider">{t('walletPayment')}</span>
                  <p className="text-xl font-black text-emerald-400 mt-0.5">
                    {formatPrice(user?.walletBalance || 0)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-theme-muted font-bold uppercase tracking-wider">{t('cartTotal')}</span>
                  <p className="text-xl font-black text-theme-primary mt-0.5">
                    {formatPrice(totalRub, totalUsd)}
                  </p>
                </div>
              </div>

              {/* Status Notice */}
              {hasEnoughBalance ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck size={16} className="flex-shrink-0" />
                  <span>Средств на балансе достаточно. Оплата спишется автоматически.</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span>Не хватает {formatPrice(totalRub - (user?.walletBalance || 0))}</span>
                  </div>
                  {onOpenWallet && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenWallet();
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 self-end sm:self-auto"
                    >
                      <PlusCircle size={14} />
                      <span>Пополнить кошелёк</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Payment Button */}
            <div className="pt-2">
              <button
                onClick={handleExecutePayment}
                disabled={processing || !hasEnoughBalance}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white text-sm font-extrabold shadow-glow-primary hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <span>Списание с кошелька...</span>
                ) : (
                  <>
                    <span>{t('completePayment')} ({formatPrice(totalRub, totalUsd)})</span>
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
