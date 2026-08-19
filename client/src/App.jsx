import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';

// Pages
import { StorePage } from './pages/StorePage';
import { LibraryPage } from './pages/LibraryPage';
import { ProfilePage } from './pages/ProfilePage';
import { WishlistPage } from './pages/WishlistPage';
import { FriendsPage } from './pages/FriendsPage';
import { AdminPage } from './pages/AdminPage';

// Modals
import { GameDetailModal } from './components/GameDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { WalletModal } from './components/WalletModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';

export function App() {
  const { user } = useAuth();
  
  // Navigation & Search State
  const [activePage, setActivePage] = useState('store');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedGameModal, setSelectedGameModal] = useState(null);
  const [checkoutItems, setCheckoutItems] = useState(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleSelectGame = (game) => {
    setSelectedGameModal(game);
  };

  const handleBuyDirect = (game) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setSelectedGameModal(null);
    setCheckoutItems([game]);
  };

  const handleProceedCheckoutFromCart = (items) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setIsCartOpen(false);
    setCheckoutItems(items);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'library':
        return <LibraryPage onSelectGame={handleSelectGame} />;
      case 'profile':
        return <ProfilePage onSelectGame={handleSelectGame} />;
      case 'wishlist':
        return <WishlistPage onSelectGame={handleSelectGame} />;
      case 'friends':
        return <FriendsPage />;
      case 'admin':
        return <AdminPage />;
      case 'store':
      default:
        return (
          <StorePage
            searchQuery={searchQuery}
            onSelectGame={handleSelectGame}
            onBuyDirect={handleBuyDirect}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-300 flex flex-col selection:bg-theme-primary selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWallet={() => {
          if (!user) setIsAuthOpen(true);
          else setIsWalletOpen(true);
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onNavigate={setActivePage}
        activePage={activePage}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        
        {/* Left Icon Sidebar */}
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          onOpenWallet={() => {
            if (!user) setIsAuthOpen(true);
            else setIsWalletOpen(true);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 pl-20 md:pl-24 pr-4 sm:pr-6 lg:pr-8 py-8 w-full min-w-0">
          {renderActivePage()}
        </main>
      </div>

      {/* Modals & Drawers */}
      {selectedGameModal && (
        <GameDetailModal
          game={selectedGameModal}
          onClose={() => setSelectedGameModal(null)}
          onBuyDirect={handleBuyDirect}
        />
      )}

      {checkoutItems && (
        <CheckoutModal
          items={checkoutItems}
          onClose={() => setCheckoutItems(null)}
          onSuccess={() => setActivePage('library')}
        />
      )}

      {isWalletOpen && (
        <WalletModal onClose={() => setIsWalletOpen(false)} />
      )}

      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}

      {isAuthOpen && (
        <AuthModal onClose={() => setIsAuthOpen(false)} />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedCheckout={handleProceedCheckoutFromCart}
      />

      {/* Floating Notifications */}
      <ToastContainer />

    </div>
  );
}
export default App;
