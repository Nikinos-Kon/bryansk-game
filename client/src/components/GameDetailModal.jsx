import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingCart, 
  Check, 
  Play, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Layers,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from 'lucide-react';

export function GameDetailModal({ game, onClose, onBuyDirect }) {
  const { lang, t } = useLang();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [activeImage, setActiveImage] = useState(game?.coverImage);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(Boolean(game?.isWishlisted));
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewIsPositive, setReviewIsPositive] = useState(true);
  const [reviewContent, setReviewContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewsList, setReviewsList] = useState(game?.reviews || []);

  if (!game) return null;

  const discount = game.discountPercent || 0;
  const finalPriceRub = discount > 0 ? Math.round(game.priceRub * (1 - discount / 100)) : game.priceRub;
  const finalPriceUsd = discount > 0 ? Number((game.priceUsd * (1 - discount / 100)).toFixed(2)) : game.priceUsd;
  const allImages = [game.coverImage, ...(game.screenshots || [])];

  const handleWishlistToggle = async () => {
    if (!user) {
      addToast({
        title: 'Требуется авторизация',
        message: 'Войдите, чтобы добавить игру в желаемое',
        icon: '🔒',
        type: 'warning'
      });
      return;
    }
    try {
      const res = await api.toggleWishlist(game.id);
      setIsWishlisted(res.isWishlisted);
      addToast({
        title: res.isWishlisted ? 'Добавлено в желаемое' : 'Удалено из желаемого',
        message: game.title,
        icon: res.isWishlisted ? '💖' : '💔'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await api.addReview({
        gameId: game.id,
        rating: reviewRating,
        isPositive: reviewIsPositive,
        content: reviewContent
      });

      setReviewsList([res.review, ...reviewsList]);
      setReviewContent('');
      addToast({
        title: 'Отзыв опубликован',
        message: 'Спасибо за ваш отзыв!',
        icon: '🌟',
        type: 'success'
      });
    } catch (err) {
      addToast({
        title: 'Ошибка',
        message: err.message,
        icon: '⚠️',
        type: 'error'
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-theme-surface border border-theme-border shadow-2xl text-theme-text my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all"
        >
          <X size={20} />
        </button>

        {/* Media Banner Section */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] overflow-hidden bg-black">
          {showTrailer && game.trailerUrl ? (
            <iframe
              src={`${game.trailerUrl}?autoplay=1`}
              title={game.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img
              src={activeImage || game.headerBanner || game.coverImage}
              alt={game.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Trailer Toggle Button Overlay */}
          {game.trailerUrl && (
            <button
              onClick={() => setShowTrailer(!showTrailer)}
              className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-black/70 hover:bg-theme-primary text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all shadow-lg"
            >
              <Play size={14} className="fill-white" />
              <span>{showTrailer ? 'Скрыть видео' : t('trailer')}</span>
            </button>
          )}
        </div>

        {/* Screenshot Thumbnails */}
        {allImages.length > 1 && !showTrailer && (
          <div className="flex gap-2.5 p-4 overflow-x-auto bg-theme-card/50 border-b border-theme-border">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`relative w-20 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImage === img ? 'border-theme-primary scale-105 shadow-md' : 'border-theme-border opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Modal Main Info */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          
          {/* Header row: Title & Categories */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {game.categories?.map((cat) => (
                  <span key={cat} className="px-2.5 py-0.5 rounded-full bg-theme-card border border-theme-border text-xs font-semibold text-theme-muted">
                    {cat}
                  </span>
                ))}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                  <Star size={12} className="fill-amber-400" />
                  <span>{game.rating}</span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-theme-text uppercase tracking-tight">{game.title}</h2>
              <p className="text-xs text-theme-muted mt-1 font-medium">
                {t('developer')}: <span className="text-theme-text font-bold">{game.developer}</span> | {t('publisher')}: <span className="text-theme-text font-bold">{game.publisher}</span>
              </p>
            </div>

            {/* Purchase CTA Box */}
            <div className="flex items-center gap-3 bg-theme-card p-3 rounded-2xl border border-theme-border shadow-inner">
              <div className="text-right">
                {discount > 0 ? (
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white font-black text-[11px]">
                      -{discount}%
                    </span>
                    <span className="text-sm line-through text-theme-muted font-bold">
                      {formatPrice(game.priceRub, game.priceUsd)}
                    </span>
                    <span className="text-xl font-black text-theme-primary">
                      {formatPrice(finalPriceRub, finalPriceUsd)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-black text-theme-primary">
                    {formatPrice(game.priceRub, game.priceUsd)}
                  </span>
                )}
              </div>

              {game.isOwned ? (
                <div className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5">
                  <Check size={16} />
                  <span>{t('inLibrary')}</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onBuyDirect(game)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white text-xs font-extrabold shadow-glow-primary hover:opacity-90 active:scale-95 transition-all"
                  >
                    {t('buyNow')}
                  </button>
                  <button
                    onClick={() => addToCart(game)}
                    className="p-2.5 rounded-xl bg-theme-surface hover:bg-theme-border border border-theme-border text-theme-text transition-all"
                    title={t('addToCart')}
                  >
                    <ShoppingCart size={18} />
                  </button>
                </>
              )}

              <button
                onClick={handleWishlistToggle}
                className={`p-2.5 rounded-xl border transition-all ${
                  isWishlisted
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-theme-surface hover:bg-theme-border text-theme-muted border-theme-border'
                }`}
                title={t('wishlist')}
              >
                <Heart size={18} className={isWishlisted ? 'fill-white' : ''} />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase text-theme-muted tracking-wider">Об игре</h3>
            <p className="text-sm text-theme-text leading-relaxed font-normal">
              {lang === 'en' ? game.descriptionEn : game.descriptionRu}
            </p>
          </div>

          {/* System Requirements */}
          {game.systemRequirements && (
            <div className="space-y-3 bg-theme-card p-5 rounded-2xl border border-theme-border">
              <h3 className="text-sm font-black uppercase text-theme-muted tracking-wider flex items-center gap-2">
                <Cpu size={16} className="text-theme-primary" />
                <span>{t('systemRequirements')}</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {game.systemRequirements.min && (
                  <div className="space-y-1.5 p-3 rounded-xl bg-theme-surface/70 border border-theme-border/60">
                    <p className="font-bold text-theme-primary uppercase text-[11px]">{t('minimum')}</p>
                    <p><span className="text-theme-muted">{t('os')}:</span> {game.systemRequirements.min.os}</p>
                    <p><span className="text-theme-muted">{t('processor')}:</span> {game.systemRequirements.min.cpu}</p>
                    <p><span className="text-theme-muted">{t('memory')}:</span> {game.systemRequirements.min.ram}</p>
                    <p><span className="text-theme-muted">{t('graphics')}:</span> {game.systemRequirements.min.gpu}</p>
                    <p><span className="text-theme-muted">{t('storage')}:</span> {game.systemRequirements.min.storage}</p>
                  </div>
                )}
                {game.systemRequirements.rec && (
                  <div className="space-y-1.5 p-3 rounded-xl bg-theme-surface/70 border border-theme-border/60">
                    <p className="font-bold text-theme-accent uppercase text-[11px]">{t('recommended')}</p>
                    <p><span className="text-theme-muted">{t('os')}:</span> {game.systemRequirements.rec.os}</p>
                    <p><span className="text-theme-muted">{t('processor')}:</span> {game.systemRequirements.rec.cpu}</p>
                    <p><span className="text-theme-muted">{t('memory')}:</span> {game.systemRequirements.rec.ram}</p>
                    <p><span className="text-theme-muted">{t('graphics')}:</span> {game.systemRequirements.rec.gpu}</p>
                    <p><span className="text-theme-muted">{t('storage')}:</span> {game.systemRequirements.rec.storage}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-theme-border">
            <h3 className="text-sm font-black uppercase text-theme-muted tracking-wider flex items-center gap-2">
              <MessageSquare size={16} className="text-theme-primary" />
              <span>{t('userReviews')} ({reviewsList.length})</span>
            </h3>

            {/* Write review form if user owns game */}
            {game.isOwned && user && (
              <form onSubmit={handleAddReview} className="bg-theme-card p-4 rounded-2xl border border-theme-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-theme-text">{t('writeReview')}:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewIsPositive(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        reviewIsPositive ? 'bg-emerald-500 text-white' : 'bg-theme-surface text-theme-muted'
                      }`}
                    >
                      <ThumbsUp size={13} />
                      <span>{t('positive')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewIsPositive(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        !reviewIsPositive ? 'bg-rose-500 text-white' : 'bg-theme-surface text-theme-muted'
                      }`}
                    >
                      <ThumbsDown size={13} />
                      <span>{t('negative')}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder={t('reviewPlaceholder')}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-text placeholder-theme-muted focus:outline-none focus:border-theme-primary resize-none"
                  required
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-glow-primary hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {submittingReview ? 'Отправка...' : t('sendReview')}
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="flex flex-col gap-3">
              {reviewsList.length === 0 ? (
                <p className="text-xs text-theme-muted italic">Пока никто не оставил отзыв. Будьте первым!</p>
              ) : (
                reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-theme-card border border-theme-border flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${rev.nickname}`}
                          alt={rev.nickname}
                          className="w-6 h-6 rounded-md object-cover"
                        />
                        <span className="text-xs font-bold text-theme-text">{rev.nickname}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        {rev.isPositive ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <ThumbsUp size={13} /> {t('positive')}
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <ThumbsDown size={13} /> {t('negative')}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-theme-text leading-relaxed">{rev.content}</p>
                    <span className="text-[10px] text-theme-muted">{rev.createdAt}</span>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
