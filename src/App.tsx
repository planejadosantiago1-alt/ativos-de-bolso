import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, CheckCircle2, UserPlus, FileVideo, LayoutDashboard, Database, ArrowLeft, MessageSquare, Play, Users, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SocialNetwork } from './components/SocialNetwork';
import LogoGenerator from './components/LogoGenerator';

// Interface para o BD de Leads
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
}

export default function App() {
  // Estados do Formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados de Controle de Visão e Dados
  const [viewMode, setViewMode] = useState<'landing' | 'admin' | 'script' | 'social' | 'assets'>('landing');
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Estado para o Vídeo do Canva (MP4)
  const [customVideo, setCustomVideo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Lida com o upload do vídeo do Canva
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setCustomVideo(url);
    }
  };
  
  // Carrega leads do SQLite Backend
  useEffect(() => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLeads(data);
      })
      .catch(err => console.error('Erro ao carregar leads:', err));
  }, []);

  // Simula o salvamento no banco de dados SQLite Server
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) return;
    
    setIsLoading(true);

    const newLead = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      message,
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
      
      const updatedLeads = await response.json();
      setLeads(updatedLeads);
      
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');

      setTimeout(() => setIsSubmitted(false), 4000);
    } catch (error) {
      console.error('Falha ao salvar o Lead', error);
      alert('Erro ao enviar cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] font-sans flex flex-col relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header Fixo - Botões de Navegação */}
      <header className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-center relative z-20 gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start" onClick={() => setViewMode('assets')}>
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-10 h-10 bg-black/50 border border-emerald-500/50 rounded-xl flex items-center justify-center rotate-3 transform transition-transform group-hover:scale-110 group-hover:-rotate-3">
              <span className="text-xl drop-shadow-lg -rotate-3">📱</span>
              <span className="text-sm drop-shadow-lg absolute -bottom-2 -right-2 bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">💰</span>
            </div>
          </div>
          <span className="font-serif italic font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-200 drop-shadow-sm">
            Ativos de Bolso
          </span>
        </div>
        
        {window.location.search.includes('admin=true') && (
        <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide justify-start md:justify-end">
          <button 
            onClick={() => setViewMode('assets')}
            className={`text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-colors shrink-0 ${viewMode === 'assets' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Logo (Download)</span>
          </button>

          <button 
            onClick={() => setViewMode('social')}
            className={`text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-colors shrink-0 ${viewMode === 'social' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
          >
            <Users className="w-4 h-4" />
            <span>Comunidade</span>
          </button>

          <button 
            onClick={() => setViewMode('script')}
            className={`text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-colors shrink-0 ${viewMode === 'script' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
          >
            <FileVideo className="w-4 h-4" />
            <span>Roteiro</span>
          </button>

          <button 
            onClick={() => setViewMode('admin')}
            className={`text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-colors shrink-0 ${viewMode === 'admin' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Cadastros</span>
          </button>
          
          <button 
            onClick={() => setViewMode('landing')}
            className={`text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-colors shrink-0 ${viewMode === 'landing' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Página Cliente</span>
          </button>
        </div>
        )}
      </header>

      {/* Area Principal - Renderiza condicionalmente Landing Page ou Admin */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10 w-full mb-8">
        <AnimatePresence mode="wait">
          
          {viewMode === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex-col flex items-center justify-center gap-16"
            >
              <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
                {/* Lado Esquerdo: Estrutura do Vídeo do Canva */}
                <div className="flex flex-col items-center lg:items-end justify-center w-full">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleVideoUpload} 
                    accept="video/mp4,video/x-m4v,video/*,image/*" 
                    className="hidden" 
                  />

                  <div className="relative w-full max-w-[320px] aspect-[9/16] bg-black border-[6px] border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/20 glass group">
                    {customVideo ? (
                      // Vídeo do Canva rodando em Loop e Mutado (background visual)
                      <video 
                        src={customVideo} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      // Placeholder quando não tem vídeo do Canva
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-black p-8 text-center cursor-pointer hover:bg-zinc-800 transition-colors"
                           onClick={() => fileInputRef.current?.click()}>
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                          <FileVideo className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Seu Vídeo (Canva)</h3>
                        <p className="text-xs text-gray-400 mb-6">Clique aqui para subir o vídeo que você exportou em MP4 (Formato Reels/TikTok 9:16).</p>
                      </div>
                    )}

                    {/* Overlay para trocar o vídeo sempre que quiser */}
                    {customVideo && (
                      <div 
                        className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <span className="text-[10px] text-white bg-black/50 px-3 py-1.5 rounded-full uppercase tracking-widest font-bold backdrop-blur-md border border-white/10">
                          Trocar Vídeo / Imagem
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              {/* Lado Direito: Formulário de Inscrição */}
              <div className="w-full max-w-md mx-auto lg:mx-0 flex flex-col justify-center">
                <div className="mb-8 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md mb-6">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Acesso VIP Automático</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-serif italic font-bold text-white mb-4 leading-tight">
                    Transforme seus gastos em investimentos.
                  </h1>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    Descubra o primeiro Consultor Financeiro focado em IA, Missões e Gamificação. 
                  </p>
                </div>

                <div className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="mb-6 relative z-10">
                    <h2 className="text-xl font-bold text-white mb-1">Entre para a Lista de Testadores</h2>
                    <p className="text-sm text-gray-400">Deixe seus dados para selecionarmos você para testar no Google Play. Sem acesso imediato.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    <div className="space-y-1">
                      <div className="relative">
                        <UserPlus className="absolute left-3 top-4 w-4 h-4 text-gray-500" />
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
                          placeholder="Como quer ser chamado?"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="relative">
                        <Mail className="absolute left-3 top-4 w-4 h-4 text-gray-500" />
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
                          placeholder="Seu melhor e-mail *"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="relative">
                        <Phone className="absolute left-3 top-4 w-4 h-4 text-gray-500" />
                        <input 
                          type="tel" 
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm"
                          placeholder="Seu WhatsApp (Receba o app por lá) *"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-gray-500" />
                        <textarea 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm min-h-[80px]"
                          placeholder="Deixe uma mensagem (opcional)"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading || isSubmitted}
                      className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:bg-emerald-500 hover:text-white mt-4 tracking-widest uppercase text-xs disabled:opacity-70 disabled:cursor-not-allowed border border-transparent hover:border-emerald-400"
                    >
                      {isLoading ? (
                        <span className="w-5 h-5 border-2 border-emerald-600 border-t-white rounded-full animate-spin"></span>
                      ) : isSubmitted ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Dados Recebidos com Sucesso!
                        </>
                      ) : (
                        'Adicionar à Lista VIP'
                      )}
                    </button>
                  </form>
                </div>
              </div>
              
              </div>

              {/* Seção de Funcionalidades Resumidas */}
              <div className="w-full max-w-5xl mt-12 mb-12">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-serif italic text-white mb-4">Funcionalidades Exclusivas</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Ativos de Bolso não é apenas mais um app financeiro. É um assistente inteligente e uma jornada transformadora em formato de jogo.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div className="glass p-6 rounded-2xl flex flex-col items-center text-center border border-white/5 hover:border-emerald-500/30 transition-colors">
                     <span className="text-4xl shadow-inner mb-4">🤖</span>
                     <h3 className="text-lg font-bold text-emerald-400 mb-2">Piloto Automático</h3>
                     <p className="text-sm text-gray-400">
                       Lê as notificações do seu banco e preenche despesas sozinho, sem planilhas.
                     </p>
                  </div>
                  {/* Card 2 */}
                  <div className="glass p-6 rounded-2xl flex flex-col items-center text-center border border-white/5 hover:border-emerald-500/30 transition-colors">
                     <span className="text-4xl shadow-inner mb-4">🎮</span>
                     <h3 className="text-lg font-bold text-emerald-400 mb-2">Gamificação</h3>
                     <p className="text-sm text-gray-400">
                       Completando missões do seu orçamento você ganha XP e sobe de nível.
                     </p>
                  </div>
                  {/* Card 3 */}
                  <div className="glass p-6 rounded-2xl flex flex-col items-center text-center border border-white/5 hover:border-emerald-500/30 transition-colors">
                     <span className="text-4xl shadow-inner mb-4">🌐</span>
                     <h3 className="text-lg font-bold text-emerald-400 mb-2">Rede Social</h3>
                     <p className="text-sm text-gray-400">
                       Converse em grupos ou convide amigos para batalhar missões de economia.
                     </p>
                  </div>
                  {/* Card 4 */}
                  <div className="glass p-6 rounded-2xl flex flex-col items-center text-center border border-white/5 hover:border-emerald-500/30 transition-colors">
                     <span className="text-4xl shadow-inner mb-4">📈</span>
                     <h3 className="text-lg font-bold text-emerald-400 mb-2">Investimentos</h3>
                     <p className="text-sm text-gray-400">
                       A IA analisa as sobras do mês e sugere como investir para criar riqueza.
                     </p>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {viewMode === 'admin' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-5xl self-start mt-8"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-serif italic text-white mb-2">Dashboard de Captura</h2>
                <p className="text-gray-400">Assim será a estrutura para você receber os dados dos Leads (futuramente conectado ao Firebase/Banco de Dados).</p>
              </div>

              <div className="glass border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-white/5 text-xs uppercase bg-emerald-500/10 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 font-bold tracking-widest text-emerald-400">Data</th>
                        <th className="px-6 py-4 font-bold tracking-widest text-emerald-400">Nome</th>
                        <th className="px-6 py-4 font-bold tracking-widest text-emerald-400">E-mail</th>
                        <th className="px-6 py-4 font-bold tracking-widest text-emerald-400">WhatsApp</th>
                        <th className="px-6 py-4 font-bold tracking-widest text-emerald-400">Mensagem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leads.length > 0 ? (
                        leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">{lead.date}</td>
                            <td className="px-6 py-4 font-medium text-white">{lead.name || 'Não informado'}</td>
                            <td className="px-6 py-4">{lead.email}</td>
                            <td className="px-6 py-4">{lead.phone}</td>
                            <td className="px-6 py-4 max-w-[200px] truncate" title={lead.message}>
                              {lead.message || <span className="text-gray-600 italic">Sem mensagem</span>}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            <Database className="w-8 h-8 text-white/20 mx-auto mb-3" />
                            Nenhum lead capturado ainda. Preencha o formulário para testar.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'script' && (
            <motion.div 
              key="script"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-3xl self-start mt-8 mx-auto"
            >
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md mb-6">
                  <FileVideo className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Roteiro Canva 50s</span>
                </div>
                <h2 className="text-3xl font-serif italic text-white mb-2">Narração do Vídeo Oficial</h2>
                <p className="text-gray-400">Copie o texto abaixo e cole no gerador de voz por IA do Canva.</p>
              </div>

              <div className="glass border border-white/10 rounded-2xl p-8 relative">
                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
                
                <div className="space-y-6 text-lg text-gray-200 leading-relaxed font-medium relative z-10">
                  <p>
                    Cansado de tentar controlar seus gastos em planilhas que você sempre abandona? 
                  </p>
                  <p>
                    Conheça o Ativos de Bolso, o aplicativo financeiro que trabalha por você. Ele lê as notificações do seu banco e cadastra cada gasto automaticamente. Zero atrito. Sem preencher nada.
                  </p>
                  <p>
                    Mas ele vai além. Nossa Inteligência Artificial cria um plano de gastos personalizado para o seu estilo de vida e gamifica suas finanças. Você ganha XP e sobe de nível a cada meta batida.
                  </p>
                  <p>
                    E você não está sozinho nessa: o app tem uma rede social exclusiva! Interaja com seus amigos, acompanhe os desafios superados em tempo real na comunidade e troque estratégias nos grupos.
                  </p>
                  <p>
                    E o melhor de tudo?  A IA analisa exatamente o que sobrou do seu salário no fim do mês e gera um plano de investimentos completamente automático para multiplicar o seu patrimônio.
                  </p>
                  <p className="text-emerald-400 italic">
                    Transforme seus gastos em investimentos. Seja VIP. Cadastre-se no link agora mesmo para ganhar 30 dias grátis, e deixe a IA trabalhar o seu dinheiro.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("Cansado de tentar controlar seus gastos em planilhas que você sempre abandona? Conheça o Ativos de Bolso, o aplicativo financeiro que trabalha por você. Ele lê as notificações do seu banco e cadastra cada gasto automaticamente. Zero atrito. Sem preencher nada. Mas ele vai além. Nossa Inteligência Artificial cria um plano de gastos personalizado para o seu estilo de vida e gamifica suas finanças. Você ganha XP e sobe de nível a cada meta batida. E você não está sozinho nessa: o app tem uma rede social exclusiva! Interaja com seus amigos, acompanhe os desafios superados em tempo real na comunidade e troque estratégias nos grupos. E o melhor de tudo? A IA analisa exatamente o que sobrou do seu salário no fim do mês e gera um plano de investimentos completamente automático para multiplicar o seu patrimônio. Transforme seus gastos em investimentos. Seja VIP. Cadastre-se no link agora mesmo para ganhar 30 dias grátis, e deixe a IA trabalhar o seu dinheiro.");
                      alert("Roteiro copiado para a área de transferência!");
                    }}
                    className="bg-white/10 hover:bg-emerald-500/20 text-white font-bold py-3 px-6 rounded-xl transition-colors border border-white/10 hover:border-emerald-500/50 flex items-center gap-2 text-sm uppercase tracking-widest"
                  >
                    Copiar Roteiro Completo
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'social' && (
            <motion.div 
              key="social"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex-1"
            >
              <SocialNetwork />
            </motion.div>
          )}

          {viewMode === 'assets' && (
            <motion.div 
              key="assets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex-1"
            >
              <LogoGenerator />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

