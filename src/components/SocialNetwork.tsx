import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Users, MessageSquare, PlusCircle, Trophy, Bell, Settings } from 'lucide-react';

export const SocialNetwork = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'direct'>('groups');
  const [activeChat, setActiveChat] = useState<number>(1);

  const groups = [
    { id: 1, name: '🏆 Desafio 10k XP', type: 'group', unread: 3, lastMessage: 'Bati a meta da semana!!', members: 12 },
    { id: 2, name: '📈 Investidores Raiz', type: 'group', unread: 0, lastMessage: 'Alguém viu a Selic hoje?', members: 45 },
    { id: 3, name: '💰 Economia Diária', type: 'group', unread: 5, lastMessage: 'Dica para economizar no mercado...', members: 128 },
  ];

  const friends = [
    { id: 4, name: 'Thiago Silva', type: 'direct', unread: 1, lastMessage: 'Me manda o convite do grupo', level: 12, isOnline: true },
    { id: 5, name: 'Mariana Costa', type: 'direct', unread: 0, lastMessage: 'Consegui guardar R$ 500!', level: 8, isOnline: true },
    { id: 6, name: 'Lucas Pedroso', type: 'direct', unread: 0, lastMessage: 'Valeu pela dica de ontem.', level: 5, isOnline: false },
  ];

  const chats = {
    1: [
      { id: 1, sender: 'Thiago Silva', isMe: false, text: 'Galera, qual a próxima meta do desafio?', time: '10:30', level: 12 },
      { id: 2, sender: 'Mariana Costa', isMe: false, text: 'Acho que é ficar 3 dias sem delivery 🍔', time: '10:32', level: 8 },
      { id: 3, sender: 'Você', isMe: true, text: 'Essa tá fácil! A IA já travou meu iFood kkkk', time: '10:35', level: 15 },
      { id: 4, sender: 'Lucas Pedroso', isMe: false, text: 'Vou tentar também. Já economizei R$ 150 essa semana!', time: '10:41', level: 5 },
    ],
    4: [
      { id: 1, sender: 'Thiago Silva', isMe: false, text: 'E aí, como tá o nível de XP?', time: 'Ontem', level: 12 },
      { id: 2, sender: 'Você', isMe: true, text: 'Tô no level 15 já! Fechei todas as missões.', time: 'Ontem', level: 15 },
      { id: 3, sender: 'Thiago Silva', isMe: false, text: 'Me manda o convite do grupo do Desafio 10k pra eu entrar.', time: '09:15', level: 12 },
    ]
  };

  const activeFeed = activeTab === 'groups' ? groups : friends;
  const currentMessages = activeChat === 1 ? chats[1] : (activeChat === 4 ? chats[4] : []);
  const activeChatInfo = [...groups, ...friends].find(c => c.id === activeChat);

  return (
    <div className="w-full h-[calc(100vh-140px)] min-h-[600px] flex gap-4 bg-transparent max-w-6xl mx-auto rounded-3xl overflow-hidden glass border border-white/5 shadow-2xl p-4">
      {/* Sidebar: Lista de Conversas */}
      <div className="w-[320px] flex-shrink-0 bg-[#0A0A0A]/60 flex flex-col rounded-2xl border border-white/5 overflow-hidden backdrop-blur-xl">
        {/* Profile / Stats */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-gradient-to-br from-emerald-900/20 to-transparent">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-lg shadow-[0_0_10px_rgba(16,185,129,0.2)]">😎</div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-sm">Seu Perfil</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-medium">Nível 15</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-3/4"></div>
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 pt-4 gap-4">
          <button 
            onClick={() => { setActiveTab('groups'); setActiveChat(1); }}
            className={`pb-2 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'groups' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Grupos
          </button>
          <button 
            onClick={() => { setActiveTab('direct'); setActiveChat(4); }}
            className={`pb-2 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'direct' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Amigos
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="bg-white/5 rounded-xl px-3 py-2 flex items-center gap-2 border border-white/5">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={activeTab === 'groups' ? "Buscar grupos..." : "Buscar amigos..."} 
              className="bg-transparent text-sm w-full outline-none text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
          {activeFeed.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setActiveChat(item.id)}
              className={`px-4 py-3 mx-2 rounded-xl flex items-center gap-3 cursor-pointer transition-colors ${activeChat === item.id ? 'bg-emerald-500/10 border border-emerald-500/20' : 'hover:bg-white/5 border border-transparent'}`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner ${item.type === 'group' ? 'bg-zinc-800 border border-zinc-700' : 'bg-zinc-800'}`}>
                  {item.type === 'group' ? item.name.split(' ')[0] : item.name.charAt(0)}
                </div>
                {item.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0A0A0A]"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-white font-bold text-sm truncate pr-2">{item.type === 'group' ? item.name.substring(3) : item.name}</h4>
                  {item.unread > 0 && typeof item.unread !== 'undefined' && typeof item.time !== 'undefined' ? (
                     <span className="text-[10px] text-emerald-400 font-bold whitespace-nowrap">Agora</span>
                  ) : (
                    item.type === 'group' ? (
                      <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">&lt; 1 min</span>
                    ) : null
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-xs truncate ${item.unread > 0 ? 'text-white font-medium' : 'text-gray-500'}`}>{item.lastMessage}</p>
                  {item.unread > 0 && (
                    <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] text-black font-bold">
                      {item.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-[#0A0A0A]/40 rounded-2xl border border-white/5 flex flex-col overflow-hidden backdrop-blur-md relative">
        {/* Chat Header */}
        <div className="h-[76px] px-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md absolute top-0 w-full z-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl shadow-inner pb-1">
               {activeChatInfo?.type === 'group' ? activeChatInfo.name.split(' ')[0] : activeChatInfo?.name.charAt(0)}
             </div>
             <div>
               <h2 className="text-white font-bold text-base flex items-center gap-2">
                 {activeChatInfo?.type === 'group' ? activeChatInfo.name.substring(3) : activeChatInfo?.name}
                 {activeChatInfo?.type === 'group' && <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-500/30">Oficial</span>}
               </h2>
               <p className="text-xs text-gray-500 mt-0.5">
                 {activeChatInfo?.type === 'group' ? `${activeChatInfo.members} membros no desafio` : `Nível ${activeChatInfo?.level} • Batalhando missões`}
               </p>
             </div>
          </div>
          <div className="flex gap-3">
             <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5 text-gray-400 hover:text-white">
               {activeChatInfo?.type === 'group' ? <Users className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
             </button>
             <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5 text-gray-400 hover:text-white">
               <Bell className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-6 pt-24 pb-6 space-y-6">
          <div className="text-center my-6">
             <span className="text-[10px] uppercase tracking-widest font-bold text-gray-600 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">Hoje</span>
          </div>

          {currentMessages.length > 0 ? (
            currentMessages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}
              >
                {!msg.isMe && (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white border border-white/10 flex-shrink-0">
                    {msg.sender.charAt(0)}
                  </div>
                )}
                <div className={`max-w-[70%] flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  {!msg.isMe && (
                    <div className="flex items-center gap-2 mb-1 pl-1">
                      <span className="text-xs text-gray-400 font-bold">{msg.sender}</span>
                      {msg.level && (
                        <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Lvl {msg.level}</span>
                      )}
                    </div>
                  )}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.isMe 
                      ? 'bg-emerald-600 text-white rounded-br-sm shadow-[0_4px_15px_rgba(5,150,105,0.4)]' 
                      : 'bg-zinc-800/80 text-gray-200 rounded-tl-sm border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.time}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
               <MessageSquare className="w-12 h-12 mb-4" />
               <p>Nenhuma mensagem ainda.</p>
               <p className="text-sm">Envie um convite para conversar!</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/40 border-t border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3 bg-zinc-900/50 p-2 rounded-2xl border border-white/5 transition-colors focus-within:border-emerald-500/50">
            <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 flex items-center justify-center transition-colors">
              <PlusCircle className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              placeholder={activeChatInfo?.type === 'group' ? "Mande uma mensagem pro grupo..." : "Mande uma mensagem direta..."}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500 px-2"
            />
            <button className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-colors transform active:scale-95">
              <Send className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
