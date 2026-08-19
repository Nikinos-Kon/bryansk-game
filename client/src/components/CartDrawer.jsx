import React from 'react';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  X, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export function CartDrawer({ isOpen, onClose, onProceedCheckout }) {
  const { cart, removeFromCart, clearCart } = useCart();
  const { lang, t } = useLang();
  const { formatPrice } = useCurrency();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-theme-surface h-full shadow-2xl border-l border-theme-border flex flex-col justify-between text-theme-text animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-theme-border flex items-center justify-between bg-theme-card/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-theme-primary/20 text-theme-primary flex items-center justify-center">
              <ShoppingCart size={19} />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">{t('cartTitle')}</h3>
              <p className="text-xs text-theme-muted">{cart.count} {cart.count === 1 ? 'игра' : 'игр'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-card transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-theme-muted">
              <div className="w-16 h-16 rounded-full bg-theme-card flex items-center justify-center text-theme-muted/50 border border-theme-border">
                <ShoppingBag size={28} />
              </div>
              <p className="text-sm font-semibold">{t('emptyCart')}</p>
              <p className="text-xs max-w-xs">Добавляйте понравившиеся игры из каталога прямо в корзину!</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.cartItemId || item.gameId}
                className="flex items-center justify-between p-3 rounded-2xl bg-theme-card border border-theme-border gap-3 group hover:border-theme-primary/50 transition-all"
              >
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-14 h-10 object-cover rounded-xl flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-theme-text truncate">{item.title}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {item.discountPercent > 0 && (
                      <span className="text-[10px] text-theme-muted line-through">
                        {formatPrice(item.originalPriceRub, item.originalPriceUsd)}
                      </span>
                    )}
                    <span className="text-xs font-black text-theme-primary">
                      {formatPrice(item.finalPriceRub, item.finalPriceUsd)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.gameId)}
                  className="p-2 rounded-xl text-theme-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Удалить из корзины"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Summary & Checkout Button */}
        {cart.items.length > 0 && (
          <div className="p-6 border-t border-theme-border bg-theme-card/60 space-y-4">
            
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs">
              {cart.summary.discountRub > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>{t('totalDiscount')}:</span>
                  <span>-{formatPrice(cart.summary.discountRub, cart.summary.discountUsd)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-theme-text pt-1 border-t border-theme-border/60">
                <span>{t('cartTotal')}:</span>
                <span className="text-xl font-black text-theme-primary">
                  {formatPrice(cart.summary.totalRub, cart.summary.totalUsd)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="p-3 rounded-2xl bg-theme-surface hover:bg-theme-border border border-theme-border text-theme-muted hover:text-rose-400 transition-colors"
                title="Очистить всю корзину"
              >
                <Trash2 size={18} />
              </button>

              <button
                onClick={() => {
                  onProceedCheckout(cart.items);
                  onClose();
                }}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white text-xs font-extrabold shadow-glow-primary hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>{t('proceedCheckout')}</span>
                <ArrowRight size={15} />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
