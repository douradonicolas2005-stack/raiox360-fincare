import { useEffect, useState } from 'react';
import { formatarMoedaCompleto } from './calculations';

function AnimatedNumber({ value, prefix = '', suffix = '', delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      current = Math.min(value, increment * step);
      setDisplayed(current);
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, value]);

  const formatted = Math.round(displayed).toLocaleString('pt-BR');

  return (
    <span className="animate-count" style={{ animationDelay: `${delay}ms` }}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

function VazamentoCard({ titulo, valorPerda, valorEconomia, descricao, delay = 0 }) {
  const [barsReady, setBarsReady] = useState(false);
  const maxVal = Math.max(valorPerda, valorEconomia);
  const barPerda = maxVal > 0 ? (valorPerda / maxVal) * 100 : 0;
  const barEconomia = maxVal > 0 ? (valorEconomia / maxVal) * 100 : 0;

  useEffect(() => {
    const t = setTimeout(() => setBarsReady(true), delay + 500);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="animate-fade-in-up opacity-0 bg-white rounded-2xl p-5 md:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <h3 className="text-sm font-semibold text-[#B8860B] mb-4 tracking-wide">{titulo}</h3>
      <p className="text-xs text-[#1A2E23]/45 mb-5 leading-relaxed">{descricao}</p>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[11px] text-[#1A2E23]/35">Vazamento atual</span>
            <span className="text-sm font-bold text-[#DC3545]">
              <AnimatedNumber value={valorPerda} prefix="R$ " delay={delay + 300} />
            </span>
          </div>
          <div className="h-1.5 bg-[#FEE8EA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#DC3545]/70 rounded-full transition-all duration-1000 ease-out"
              style={{ width: barsReady ? `${barPerda}%` : '0%', transitionDelay: '200ms' }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[11px] text-[#1A2E23]/35">Otimizado</span>
            <span className="text-sm font-bold text-[#00A651]">
              <AnimatedNumber value={valorEconomia} prefix="R$ " delay={delay + 600} />
            </span>
          </div>
          <div className="h-1.5 bg-[#E8F5EC] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00A651]/70 rounded-full transition-all duration-1000 ease-out"
              style={{ width: barsReady ? `${barEconomia}%` : '0%', transitionDelay: '400ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Step3({ resultados, onNext }) {
  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <p className="text-[10px] tracking-[0.25em] uppercase text-white/60 mb-3 font-semibold animate-pulse-subtle">
          Alerta de vazamento patrimonial
        </p>
        <h1 className="text-xl md:text-[26px] font-bold text-white leading-tight mb-2">
          Encontramos{' '}
          <span className="text-white">
            <AnimatedNumber value={resultados.total.economia5Anos} prefix="R$ " />
          </span>{' '}
          de vazamento nos proximos 5 anos
        </h1>
        <p className="text-xs text-white/50 mt-2">
          Analise baseada no perfil informado &mdash; Fincare Engenharia Patrimonial
        </p>
      </div>

      <div className="space-y-4">
        <VazamentoCard
          titulo="VAZAMENTO 1 \u2014 Imposto Invisivel"
          valorPerda={resultados.imposto.perdaAtual}
          valorEconomia={resultados.imposto.perdaOtimizada}
          descricao={`Seus ${formatarMoedaCompleto(resultados.imposto.valorBanco)} no bancao estao te custando ${formatarMoedaCompleto(resultados.imposto.perdaAtual)}/ano em IR + taxas. Otimizado: ${formatarMoedaCompleto(resultados.imposto.perdaOtimizada)}/ano. Economia: ${formatarMoedaCompleto(resultados.imposto.economiaAno)}/ano`}
          delay={200}
        />

        <VazamentoCard
          titulo="VAZAMENTO 2 \u2014 Custo de Inventario"
          valorPerda={resultados.inventario.custoPF}
          valorEconomia={resultados.inventario.custoHolding}
          descricao={`Inventario PF: ${formatarMoedaCompleto(resultados.inventario.custoPF)} (${resultados.inventario.tempoPF}). Holding: ${formatarMoedaCompleto(resultados.inventario.custoHolding)} (${resultados.inventario.tempoHolding}). Economia: ${formatarMoedaCompleto(resultados.inventario.economia)}`}
          delay={500}
        />

        {resultados.juros.temFinanciamento && (
          <VazamentoCard
            titulo="VAZAMENTO 3 \u2014 Juros de Financiamento"
            valorPerda={resultados.juros.custoFinanciamento}
            valorEconomia={resultados.juros.custoConsorcio}
            descricao={`Financiamento: ${formatarMoedaCompleto(resultados.juros.custoFinanciamento)} de juros. Consorcio estrategico: ${formatarMoedaCompleto(resultados.juros.custoConsorcio)} de taxa. Economia: ${formatarMoedaCompleto(resultados.juros.economia)} + 1 imovel extra via alavancagem`}
            delay={800}
          />
        )}
      </div>

      {/* Card Grande - escuro para contraste */}
      <div
        className="animate-fade-in-up opacity-0 mt-8 rounded-2xl p-6 md:p-8 text-center bg-[#1A2E23] shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
        style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}
      >
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2 font-semibold">
          Potencial total de economia em 5 anos
        </p>
        <p className="text-3xl md:text-4xl font-bold text-[#C9A86A] mb-4">
          <AnimatedNumber value={resultados.total.economia5Anos} prefix="R$ " delay={1400} />
        </p>
        <div className="h-px bg-white/10 my-3" />
        <p className="text-sm text-white/50">
          Seu tempo para aposentadoria: de{' '}
          <span className="font-bold text-white/80">{resultados.total.anosAtuais} anos</span>{' '}
          para{' '}
          <span className="font-bold text-[#C9A86A]">{resultados.total.anosReduzido} anos</span>
        </p>
      </div>

      <div className="mt-8">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl text-base font-semibold tracking-wide bg-white text-[#00A651] hover:bg-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-300"
        >
          Ver meu Mapa de Engenharia
          <svg className="inline-block ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
