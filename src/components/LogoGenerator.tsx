import React, { useRef } from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';

export default function LogoGenerator() {
  const svgRef = useRef<SVGSVGElement>(null);

  const downloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ativos-de-bolso-logo.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPng = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Set high resolution for Google Play (1024x1024)
    canvas.width = 1024;
    canvas.height = 1024;
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 1024, 1024);
      const pngFile = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'ativos-de-bolso-icon.png';
      link.href = pngFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center space-y-8 mt-8">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-serif italic text-white mb-2">Assets Oficiais</h2>
        <p className="text-gray-400 max-w-lg mx-auto">
          Baixe o seu logo (1024x1024) que desenhei no estilo Game/Emoji para você usar no vídeo, e também publicar direto na capa da Play Store.
        </p>
      </div>

      <div className="glass p-8 md:p-14 rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden border border-emerald-500/20 group shadow-2xl shadow-emerald-500/10">
        <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] group-hover:bg-emerald-500/20 transition-colors duration-700" />
        
        {/* SVG Logo Renderizado Vivo (Perfeito para exportar SVG e PNG limpos em qualquer OS sem quebra de fonte de Emoji) */}
        <svg 
          ref={svgRef}
          width="1024" 
          height="1024" 
          viewBox="0 0 1024 1024" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-[300px] h-[300px] md:w-[512px] md:h-[512px] drop-shadow-2xl relative z-10 transition-transform group-hover:scale-105 duration-500"
        >
          <defs>
             <filter id="shadow">
               <feDropShadow dx="0" dy="20" stdDeviation="20" floodOpacity="0.5" />
             </filter>
             <filter id="glow">
               <feDropShadow dx="0" dy="0" stdDeviation="40" floodColor="#10B981" floodOpacity="0.4" />
             </filter>
          </defs>

          {/* Fundo e Container Principal */}
          <g transform="translate(480, 480) rotate(5)">
            <rect x="-300" y="-300" width="600" height="600" rx="140" fill="#0A0A0A" stroke="#10B981" strokeWidth="24" filter="url(#glow)" />
            {/* Ícone de Celular */}
            <text x="0" y="140" fontSize="400" textAnchor="middle" fontFamily="sans-serif" filter="url(#shadow)" transform="rotate(-5)">📱</text>
          </g>

          {/* Badge de Dinheiro */}
          <g transform="translate(780, 780)">
            <circle cx="0" cy="0" r="140" fill="#10B981" stroke="#000000" strokeWidth="32" filter="url(#shadow)" />
            {/* Ícone de Saco de Dinheiro */}
            <text x="0" y="70" fontSize="200" textAnchor="middle" fontFamily="sans-serif">💰</text>
          </g>
        </svg>

      </div>

      <div className="flex flex-col gap-4 w-full max-w-lg">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button 
            onClick={downloadPng}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 px-6 rounded-xl transition-colors emerald-glow flex items-center justify-center gap-2 uppercase tracking-widest text-xs flex-1"
          >
            <ImageIcon className="w-4 h-4" />
            Baixar PNG (Play Store)
          </button>
          <button 
            onClick={downloadSvg}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-2 uppercase tracking-widest text-xs flex-1"
          >
            <Download className="w-4 h-4" />
            Baixar SVG (Vetor)
          </button>
        </div>
        <p className="text-[10px] text-gray-500 text-center">
          ⚠️ Nota: Se o download não iniciar devido ao painel de preview, clique no botão de "Abrir em Nova Guia" (canto superior direito) para que o navegador libere o download.
        </p>
      </div>
    </div>
  );
}
