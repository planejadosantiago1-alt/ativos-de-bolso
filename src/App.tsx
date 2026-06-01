import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, CheckCircle2, UserPlus, FileVideo, MessageSquare, Volume2, VolumeX, Database, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Interface para os Leads
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
  
  // Estado para o Vídeo
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Estados para Administrador (Leads)
  const [viewMode, setViewMode] = useState<'landing' | 'admin'>('landing');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carrega os leads sempre que abrir o painel de admin
  useEffect(() => {
    if (viewMode === 'admin') {
      fetch('/api/leads')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setLeads(data);
        })
        .catch(err => console.error('Erro ao carregar leads:', err));
    }
  }, [viewMode]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) return;
    
    setIsLoading(true);

    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      message,
      date: new Date().toLocaleString('pt-BR')
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
      setIsLoading(false);

      setTimeout(() => setIsSubmitted(false), 4000);
    } catch (error) {
      console.error('Falha ao salvar o Lead', error);
      alert('Erro ao enviar cadastro. Tente novamente.');
      setIsLoading(false);
    }
  };

  const handleAdminAccess = () => {
    const password = window.prompt("Digite a senha de administrador (admin123) para ver os leads capturados:");
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setViewMode('admin');
    } else if (password !== null) {
      alert("Senha incorreta!");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] font-sans flex flex-col relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header Fixo */}
      <header className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-center relative z-20 gap-4">
        <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
          <div className="relative group">
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
        
        <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide justify-start md:justify-end">
          {viewMode === 'admin' ? (
            <button 
              onClick={() => setViewMode('landing')}
              className={`text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-colors shrink-0 text-emerald-400 hover:text-emerald-300`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para Site</span>
            </button>
          ) : (
            <button 
              onClick={handleAdminAccess}
              className={`text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-colors shrink-0 text-gray-400 hover:text-white`}
            >
              <Database className="w-4 h-4" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </header>

      {/* Area Principal */}
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
            {/* Lado Esquerdo: Estrutura do Vídeo Permanente */}
            <div className="flex flex-col items-center lg:items-end justify-center w-full">
              <div className="relative w-full max-w-[320px] aspect-[9/16] bg-black border-[6px] border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/20 glass group">
                <video 
                  ref={videoRef}
                  src="/video.mp4" 
                  autoPlay 
                  loop 
                  muted={isMuted} 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
                
                {/* Fallback caso falhe o carregamento */}
                <div className="absolute inset-0 hidden flex-col items-center justify-center bg-zinc-900 p-8 text-center border-2 border-dashed border-white/20">
                  <FileVideo className="w-12 h-12 text-gray-500 mb-4" />
                  <p className="text-sm font-bold text-gray-400">Vídeo não encontrado</p>
                  <p className="text-xs text-gray-500 mt-2">Você precisa enviar o arquivo com nome exato "video.mp4" aqui no chat para a pasta public.</p>
                </div>

                {/* Botão de Áudio */}
                <button 
                  onClick={toggleMute}
                  className="absolute bottom-6 right-6 w-12 h-12 bg-black/60 hover:bg-emerald-500/80 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-lg transition-all z-20 group-hover:scale-110"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white animate-pulse" />
                  )}
                </button>
                
                {isMuted && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 pointer-events-none z-20">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest whitespace-nowrap">
                      Toque para ouvir
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
                <p className="text-sm text-gray-400">Deixe seus dados para selecionarmos você para testar no Google Play.</p>
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
              <div className="mb-8 flex justify-between items-end flex-wrap gap-4">
                <div>
                  <h2 className="text-3xl font-serif italic text-white mb-2">Painel de Administração</h2>
                  <p className="text-gray-400">Aqui ficam armazenados os dados de quem deseja acesso VIP.</p>
                </div>
              </div>

              {/* Tabela de Leads */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white mb-4">Leads Capturados</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      if (leads.length === 0) {
                        alert('Nenhum dado para exportar.');
                        return;
                      }
                      const headers = ['Data', 'Nome', 'E-mail', 'WhatsApp', 'Mensagem'];
                      const csvContent = [
                        headers.join(','),
                        ...leads.map(lead => [
                          `"${lead.date}"`,
                          `"${lead.name}"`,
                          `"${lead.email}"`,
                          `"${lead.phone}"`,
                          `"${lead.message.replace(/\n/g, ' ')}"`
                        ].join(','))
                      ].join('\n');
                      
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.setAttribute('href', url);
                      link.setAttribute('download', 'leads_ativos_de_bolso.csv');
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="text-xs text-white hover:text-emerald-300 transition-colors uppercase tracking-widest font-bold px-4 py-2 border border-emerald-500/50 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30"
                  >
                    Exportar Planilha (CSV)
                  </button>
                  <button 
                    onClick={async () => {
                      if (window.confirm('Tem certeza que deseja apagar todos os leads?')) {
                        try {
                          await fetch('/api/leads', { method: 'DELETE' });
                          setLeads([]);
                        } catch (error) {
                          console.error('Erro ao deletar leads', error);
                        }
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest font-bold px-4 py-2 border border-red-500/20 rounded-md bg-red-500/10 hover:bg-red-500/20"
                  >
                    Limpar Dados
                  </button>
                </div>
              </div>

              <div className="glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
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

        </AnimatePresence>
      </main>
    </div>
  );
}

