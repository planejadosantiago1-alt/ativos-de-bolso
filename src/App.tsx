import React, { useState, useRef } from 'react';
import { Mail, Phone, CheckCircle2, UserPlus, FileVideo, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  // Estados do Formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) return;
    
    setIsLoading(true);

    // Simula o tempo de envio (já que é uma página estática sem backend)
    setTimeout(() => {
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setIsLoading(false);

      setTimeout(() => setIsSubmitted(false), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] font-sans flex flex-col relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header Fixo */}
      <header className="p-4 md:p-6 flex justify-center md:justify-start items-center relative z-20">
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
      </header>

      {/* Area Principal */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10 w-full mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex-col flex items-center justify-center gap-16"
        >
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Lado Esquerdo: Estrutura do Vídeo do Canva */}
            <div className="flex flex-col items-center lg:items-end justify-center w-full">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleVideoUpload} 
                accept="video/mp4,video/x-m4v,video/*" 
                className="hidden" 
              />

              <div className="relative w-full max-w-[320px] aspect-[9/16] bg-black border-[6px] border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/20 glass group">
                {customVideo ? (
                  <video 
                    src={customVideo} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-black p-8 text-center cursor-pointer hover:bg-zinc-800 transition-colors"
                       onClick={() => fileInputRef.current?.click()}>
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                      <FileVideo className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Seu Vídeo (Canva)</h3>
                    <p className="text-xs text-gray-400 mb-6">Clique aqui para subir o vídeo que você exportou em MP4 (Formato Reels/TikTok 9:16).</p>
                  </div>
                )}

                {customVideo && (
                  <div 
                    className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="text-[10px] text-white bg-black/50 px-3 py-1.5 rounded-full uppercase tracking-widest font-bold backdrop-blur-md border border-white/10">
                      Trocar Vídeo
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
      </main>
    </div>
  );
}

