import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useNotification } from '../context/NotificationContext';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  MessageSquare, 
  Send, 
  Circle, 
  Search, 
  Gamepad2, 
  Sparkles,
  X
} from 'lucide-react';

export function FriendsPage() {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const { addToast } = useNotification();

  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Chat simulation state
  const [activeChatFriend, setActiveChatFriend] = useState(null);
  const [messages, setMessages] = useState({});
  const [chatInput, setChatInput] = useState('');

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const data = await api.getFriends();
      setFriends(data.friends || []);
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  const handleAddFriend = async (targetUserId) => {
    try {
      await api.addFriend(targetUserId);
      addToast({
        title: 'Запрос принят',
        message: 'Пользователь добавлен в список друзей!',
        icon: '🤝',
        type: 'success'
      });
      fetchFriends();
    } catch (err) {
      addToast({
        title: 'Ошибка',
        message: err.message,
        icon: '⚠️',
        type: 'error'
      });
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await api.removeFriend(friendId);
      addToast({
        title: 'Удалено',
        message: 'Пользователь удален из друзей',
        icon: '👋'
      });
      fetchFriends();
      if (activeChatFriend?.id === friendId) {
        setActiveChatFriend(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatFriend) return;

    const friendId = activeChatFriend.id;
    const newMsg = {
      id: Date.now(),
      sender: user.nickname,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), newMsg]
    }));

    setChatInput('');

    // Simulate friend auto-reply after 1.5s
    setTimeout(() => {
      const replies = [
        'Привет! Го в катку вечером?',
        'Видел скидки в магазине Bryansk_game? Топчик!',
        'Я сейчас прохожу Cyberpunk 2077, графика просто космос.',
        'Добавь меня в лобби, я готов играть.'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const botMsg = {
        id: Date.now() + 1,
        sender: activeChatFriend.nickname,
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => ({
        ...prev,
        [friendId]: [...(prev[friendId] || []), botMsg]
      }));
    }, 1200);
  };

  if (!user) {
    return (
      <div className="p-12 text-center rounded-3xl bg-theme-surface border border-theme-border text-theme-text space-y-4 max-w-md mx-auto">
        <Users size={36} className="mx-auto text-theme-primary" />
        <h2 className="text-xl font-black">Войдите в аккаунт</h2>
        <p className="text-xs text-theme-muted">Чтобы видеть друзей онлайн и общаться в чате.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      
      {/* Left: Friends List & Suggestions */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Friends Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-theme-primary/20 text-theme-primary flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-theme-text uppercase tracking-tight">{t('friendsTitle')}</h1>
              <p className="text-xs text-theme-muted">{friends.length} друзей</p>
            </div>
          </div>
        </div>

        {/* Friends List */}
        <div className="space-y-3">
          {friends.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-theme-surface border border-theme-border text-theme-muted space-y-2">
              <Users size={30} className="mx-auto text-theme-muted/40" />
              <p className="text-xs font-bold text-theme-text">Список друзей пуст</p>
              <p className="text-[11px]">Добавьте пользователей из рекомендаций ниже!</p>
            </div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend.id}
                className="p-4 rounded-2xl bg-theme-surface border border-theme-border flex items-center justify-between gap-3 hover:border-theme-primary/60 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={friend.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${friend.nickname}`}
                      alt={friend.nickname}
                      className="w-11 h-11 rounded-xl object-cover border border-theme-border"
                    />
                    <Circle
                      size={10}
                      className={`absolute -bottom-0.5 -right-0.5 rounded-full ${
                        friend.isOnline
                          ? friend.statusText.includes('В игре')
                            ? 'fill-emerald-400 text-emerald-400'
                            : 'fill-blue-400 text-blue-400'
                          : 'fill-gray-500 text-gray-500'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-theme-text">{friend.nickname}</h4>
                      <span className="text-[10px] px-1 rounded bg-theme-card border border-theme-border text-theme-muted font-bold">
                        lvl {friend.level || 1}
                      </span>
                    </div>
                    <p className={`text-[11px] font-medium mt-0.5 ${
                      friend.statusText.includes('В игре')
                        ? 'text-emerald-400'
                        : friend.isOnline
                        ? 'text-blue-400'
                        : 'text-theme-muted'
                    }`}>
                      {friend.statusText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveChatFriend(friend)}
                    className="px-3 py-1.5 rounded-xl bg-theme-card hover:bg-theme-primary hover:text-white border border-theme-border text-theme-text text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <MessageSquare size={13} />
                    <span>{t('chat')}</span>
                  </button>

                  <button
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="p-1.5 rounded-xl text-theme-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Удалить из друзей"
                  >
                    <UserMinus size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-theme-border">
            <h3 className="text-xs font-black uppercase text-theme-muted tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              <span>Рекомендуемые игроки</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestions.map((userSug) => (
                <div key={userSug.id} className="p-3 rounded-2xl bg-theme-card border border-theme-border flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={userSug.avatar} alt={userSug.nickname} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-theme-text truncate">{userSug.nickname}</p>
                      <p className="text-[10px] text-theme-muted truncate">{userSug.bio || 'Геймер'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFriend(userSug.id)}
                    className="p-2 rounded-xl bg-theme-surface hover:bg-theme-primary hover:text-white border border-theme-border text-theme-primary transition-all flex-shrink-0"
                    title="Добавить в друзья"
                  >
                    <UserPlus size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Right: Steam Direct Chat Simulation */}
      <div className="lg:col-span-1 rounded-3xl bg-theme-surface border border-theme-border flex flex-col justify-between h-[540px] shadow-xl overflow-hidden">
        
        {activeChatFriend ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-theme-border bg-theme-card/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeChatFriend.avatar}
                  alt={activeChatFriend.nickname}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-xs text-theme-text leading-tight">{activeChatFriend.nickname}</h4>
                  <p className="text-[10px] text-emerald-400">{activeChatFriend.statusText}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveChatFriend(null)}
                className="p-1 rounded-lg text-theme-muted hover:text-theme-text"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {(messages[activeChatFriend.id] || []).length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-xs text-theme-muted italic">
                  Начните диалог с {activeChatFriend.nickname}...
                </div>
              ) : (
                (messages[activeChatFriend.id] || []).map((msg) => {
                  const isMe = msg.sender === user.nickname;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] p-2.5 rounded-2xl text-xs ${
                        isMe
                          ? 'bg-theme-primary text-white rounded-tr-none'
                          : 'bg-theme-card text-theme-text border border-theme-border rounded-tl-none'
                      }`}>
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[9px] text-theme-muted mt-0.5">{msg.time}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-theme-border bg-theme-card/30 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Напишите сообщение..."
                className="flex-1 px-3 py-2 rounded-xl bg-theme-card border border-theme-border text-xs text-theme-text placeholder-theme-muted focus:outline-none focus:border-theme-primary"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-theme-primary text-white hover:opacity-90 shadow-glow-primary transition-all"
              >
                <Send size={14} />
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-theme-muted space-y-2">
            <MessageSquare size={32} className="text-theme-muted/30" />
            <h4 className="font-bold text-xs text-theme-text">Чат Steam / Bryansk</h4>
            <p className="text-[11px]">Выберите друга из списка слева для начала общения.</p>
          </div>
        )}

      </div>

    </div>
  );
}
