import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { MessageSquare, X, Send } from 'lucide-react';

export function SupportModal({ onClose }) {
  const { t } = useLang();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Здравствуйте! Опишите вашу проблему, и мы постараемся вам помочь.', sender: 'support' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Auto-reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Возможно, это является вашей проблемой:\n1. Ошибка при оплате\n2. Игра не запускается\n3. Проблема с аккаунтом\n4. Баг в приложении\n\nПожалуйста, уточните детали.',
          sender: 'support'
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-theme-surface border border-theme-border shadow-2xl text-theme-text overflow-hidden flex flex-col h-[600px] max-h-[80vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-theme-border flex items-center justify-between bg-theme-card/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-md">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">Поддержка</h3>
              <p className="text-xs text-theme-muted">Мы онлайн 24/7</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-card transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-sm whitespace-pre-wrap ${
                msg.sender === 'user' 
                  ? 'bg-theme-primary text-white rounded-tr-sm' 
                  : 'bg-theme-card border border-theme-border text-theme-text rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-theme-border bg-theme-surface">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Написать сообщение..."
              className="w-full bg-theme-card border border-theme-border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-theme-primary transition-colors text-theme-text placeholder-theme-muted"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 p-2 bg-theme-primary text-white rounded-lg hover:bg-theme-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
