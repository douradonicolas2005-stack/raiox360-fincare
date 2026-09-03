import { useState } from 'react';
import { formatarMoedaCompleto } from './calculations';
import { gerarPDF } from './pdfGenerator';

function ShieldIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

export default function Step4({ resultados, formData, leadData, onRestart }) {
  const [pdfGerado, setPdfGerado] = useState(false);
  const [gerando, setGerando] = useState(false);

  const handleDownloadPDF = async () => {
    setGerando(true);
    await new Promise(r => setTimeout(r, 600));
    gerarPDF(resultados, formData, leadData);
    setGerando(false);
    setPdfGerado(true);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A86A]/70 mb-3 font-semibold">
          Mapa de Engenharia Patrimonial
        </p>
        <h1 className="text-2xl md:text-[28px] font-bold text-[#E2E8F0] leading-tight">
          Seu Mapa em 3 Camadas
        </h1>
        <p className="text-xs text-[#5E7B6E] mt-2">
          Personalizado para o perfil de {leadData.nome?.split(' ')[0]}
        </p>
      </div>

      {/* 3 Colunas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {/* Protecao */}
        <div className="animate-fade-in-up opacity-0 bg-[#16382D] rounded-2xl p-5 relative overflow-hidden border border-[#1F4A3A] shadow-[0_2px_16px_rgba(0,0,0,0.3)]" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C9A86A]" />
          <div className="flex items-center gap-2 mb-4 text-[#C9A86A]">
            <ShieldIcon />
            <span className="text-xs font-semibold tracking-[0.1em] uppercase">Protecao</span>
          </div>
          <ul className="space-y-3">
            <li className="flex gap-2 text-[11px] text-[#8AA59A] leading-relaxed">
              <span className="text-[#C9A86A]/70 mt-0.5 shrink-0 font-mono text-[10px]">01</span>
              Migrar imoveis da PF para Holding para zerar ITCMD na sucessao
            </li>
            <li className="flex gap-2 text-[11px] text-[#8AA59A] leading-relaxed">
              <span className="text-[#C9A86A]/70 mt-0.5 shrink-0 font-mono text-[10px]">02</span>
              Trocar previdencia do bancao por PGBL/VGBL com taxa 0,5% e sucessao direta
            </li>
            <li className="flex gap-2 text-[11px] text-[#8AA59A] leading-relaxed">
              <span className="text-[#C9A86A]/70 mt-0.5 shrink-0 font-mono text-[10px]">03</span>
              Criar seguro de vida resgatavel para liquidez do inventario
            </li>
          </ul>
        </div>

        {/* Eficiencia */}
        <div className="animate-fade-in-up opacity-0 bg-[#16382D] rounded-2xl p-5 relative overflow-hidden border border-[#1F4A3A] shadow-[0_2px_16px_rgba(0,0,0,0.3)]" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#00A651]" />
          <div className="flex items-center gap-2 mb-4 text-[#00A651]">
            <ChartIcon />
            <span className="text-xs font-semibold tracking-[0.1em] uppercase">Eficiencia</span>
          </div>
          <ul className="space-y-3">
            <li className="flex gap-2 text-[11px] text-[#8AA59A] leading-relaxed">
              <span className="text-[#00A651]/80 mt-0.5 shrink-0 font-mono text-[10px]">01</span>
              Migrar {formatarMoedaCompleto(resultados.imposto.valorBanco)} de CDB 92% CDI para FII de papel + LCI 95% CDI isento
            </li>
            <li className="flex gap-2 text-[11px] text-[#8AA59A] leading-relaxed">
              <span className="text-[#00A651]/80 mt-0.5 shrink-0 font-mono text-[10px]">02</span>
              Ganho liquido estimado: {formatarMoedaCompleto(resultados.imposto.economiaAno)}/ano
            </li>
            <li className="flex gap-2 text-[11px] text-[#8AA59A] leading-relaxed">
              <span className="text-[#00A651]/80 mt-0.5 shrink-0 font-mono text-[10px]">03</span>
              Utilizar FGTS de R$ 45k como lance em consorcio imobiliario
            </li>
          </ul>
        </div>

        {/* Alavancagem */}
        <div className="animate-fade-in-up opacity-0 bg-[#16382D] rounded-2xl p-5 relative overflow-hidden border border-[#1F4A3A] shadow-[0_2px_16px_rgba(0,0,0,0.3)]" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C9A86A]/70" />
          <div className="flex items-center gap-2 mb-4 text-[#C9A86A]/80">
            <BuildingIcon />
            <span className="text-xs font-semibold tracking-[0.1em] uppercase">Alavancagem</span>
          </div>
          <ul className="space-y-3">
            <li className="flex gap-2 text-[11px] text-[#8AA59A] leading-relaxed">
              <span className="text-[#C9A86A]/60 mt-0.5 shrink-0 font-mono text-[10px]">01</span>
              Usar R$ 150k de caixa para 2 cartas contempladas de R$ 400k
            </li>
            <li className="flex gap-2 text-[11px] text-[#8AA59A] leading-relaxed">
              <span className="text-[#C9A86A]/60 mt-0.5 shrink-0 font-mono text-[10px]">02</span>
              Estrategia: Aluguel das cartas paga 80% das parcelas
            </li>
            <li className="flex gap-2 text-[11px] text-[#8AA59A] leading-relaxed">
              <span className="text-[#C9A86A]/60 mt-0.5 shrink-0 font-mono text-[10px]">03</span>
              Patrimonio final projetado: R$ 800k com R$ 150k de entrada
            </li>
          </ul>
        </div>
      </div>

      {/* Resumo */}
      <div
        className="animate-fade-in-up opacity-0 bg-[#16382D] rounded-2xl p-5 mb-6 text-center border border-[#C9A86A]/30 shadow-[0_2px_16px_rgba(0,0,0,0.3)]"
        style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
      >
        <p className="text-[10px] text-[#5E7B6E] mb-1 uppercase tracking-wider">Economia potencial em 5 anos</p>
        <p className="text-2xl font-bold text-[#C9A86A]">{formatarMoedaCompleto(resultados.total.economia5Anos)}</p>
      </div>

      {/* Download */}
      <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}>
        <button
          onClick={handleDownloadPDF}
          disabled={gerando}
          className={`w-full py-4 rounded-2xl text-base font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
            gerando
              ? 'bg-[#2A5445]/50 text-[#5E7B6E] cursor-wait'
              : pdfGerado
                ? 'bg-[#00A651] text-[#0C2017]'
                : 'bg-[#C9A86A] text-[#0C2017] hover:bg-[#D9BB82] shadow-[0_4px_20px_rgba(201,168,106,0.25)]'
          }`}
        >
          {gerando ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Gerando PDF confidencial...
            </>
          ) : pdfGerado ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              PDF baixado com sucesso
            </>
          ) : (
            <>
              <DownloadIcon />
              Baixar Raio-X Patrimonial completo em PDF
            </>
          )}
        </button>

        {pdfGerado && (
          <p className="text-[11px] text-[#5E7B6E] text-center mt-3">
            Seu relatorio confidencial foi gerado. Nossa equipe entrara em contato em ate 2h.
          </p>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onRestart}
          className="text-[11px] text-[#5E7B6E] hover:text-[#8AA59A] transition-colors"
        >
          Nova simulacao
        </button>
      </div>
    </div>
  );
}
