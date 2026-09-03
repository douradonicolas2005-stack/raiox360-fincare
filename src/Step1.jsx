import { useState } from 'react';

export default function Step1({ data, onChange, onNext }) {
  const totalDivisao = data.divisao.imoveis + data.divisao.banco + data.divisao.investimentos + data.divisao.empresa;

  const handleSlider = (field, value) => {
    onChange({ ...data, [field]: Number(value) });
  };

  const handleDivisao = (field, value) => {
    const nova = { ...data.divisao, [field]: Number(value) };
    onChange({ ...data, divisao: nova });
  };

  const handleSelect = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const formatCurrency = (val) => {
    if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(1).replace('.0', '')}M`;
    return `R$ ${(val / 1000).toFixed(0)}k`;
  };

  const isValid = totalDivisao === 100 && data.estrutura && data.maiorDor;

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <p className="text-[10px] tracking-[0.25em] uppercase text-white/50 mb-3 font-semibold">
          Fincare &mdash; Engenharia Patrimonial
        </p>
        <h1 className="text-2xl md:text-[30px] font-bold text-white leading-tight mb-3">
          Raio-X Patrimonial do seu Patrimonio
        </h1>
        <p className="text-sm text-white/60 max-w-md mx-auto">
          Descubra em 3 minutos quanto esta vazando em imposto, inventario e juros
        </p>
        <p className="text-[10px] text-white/35 mt-3 tracking-wide">
          Analise calibrada para patrimonios acima de R$ 500k &mdash; Dados 100% confidenciais
        </p>
      </div>

      <div className="space-y-4">
        {/* Patrimonio Total */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium text-[#1A2E23]/70">Patrimonio total estimado</label>
            <span className="text-lg font-bold text-[#00A651]">{formatCurrency(data.patrimonio)}</span>
          </div>
          <input
            type="range"
            min="500000"
            max="10000000"
            step="100000"
            value={data.patrimonio}
            onChange={(e) => handleSlider('patrimonio', e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-[#1A2E23]/30">R$ 500k</span>
            <span className="text-[10px] text-[#1A2E23]/30">R$ 10M+</span>
          </div>
        </div>

        {/* Divisao */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-[#1A2E23]/70">Divisao atual</label>
            <span className={`text-sm font-bold ${totalDivisao === 100 ? 'text-[#00A651]' : 'text-[#DC3545]'}`}>
              {totalDivisao}%
            </span>
          </div>
          {totalDivisao !== 100 && (
            <p className="text-[11px] text-[#DC3545]/70 mb-3">Os sliders devem somar 100%</p>
          )}

          <div className="space-y-5 mt-4">
            {[
              { key: 'imoveis', label: 'Imoveis na PF' },
              { key: 'banco', label: 'Dinheiro em Banco / CDB / Fundo' },
              { key: 'investimentos', label: 'Investimentos (FII, Acoes, Exterior)' },
              { key: 'empresa', label: 'Empresa / Participacoes' },
            ].map(({ key, label }) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-[#1A2E23]/55">{label}</span>
                  <span className="text-sm font-semibold text-[#B8860B]">{data.divisao[key]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={data.divisao[key]}
                  onChange={(e) => handleDivisao(key, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Barra visual */}
          <div className="flex h-1.5 rounded-full overflow-hidden mt-4 bg-[#E8F5EC]">
            <div className="bg-[#00A651]/60 transition-all duration-300" style={{ width: `${data.divisao.imoveis}%` }} />
            <div className="bg-[#00A651]/40 transition-all duration-300" style={{ width: `${data.divisao.banco}%` }} />
            <div className="bg-[#B8860B]/40 transition-all duration-300" style={{ width: `${data.divisao.investimentos}%` }} />
            <div className="bg-[#B8860B]/20 transition-all duration-300" style={{ width: `${data.divisao.empresa}%` }} />
          </div>
        </div>

        {/* Estrutura Atual */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
          <label className="text-sm font-medium text-[#1A2E23]/70 block mb-3">Estrutura atual</label>
          <div className="space-y-2">
            {['Tudo na PF', 'Parte em PJ', 'Tenho Holding'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect('estrutura', opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                  data.estrutura === opt
                    ? 'border-[#00A651] bg-[#00A651]/5 text-[#00A651] font-medium'
                    : 'border-[#E0EDE4] bg-[#F8FAF9] text-[#1A2E23]/55 hover:border-[#00A651]/30 hover:bg-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Maior Dor */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
          <label className="text-sm font-medium text-[#1A2E23]/70 block mb-3">Maior dor hoje</label>
          <div className="space-y-2">
            {[
              'Pagar menos imposto',
              'Proteger para filhos',
              'Parar de pagar juros',
              'Diversificar fora do Brasil',
            ].map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect('maiorDor', opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                  data.maiorDor === opt
                    ? 'border-[#00A651] bg-[#00A651]/5 text-[#00A651] font-medium'
                    : 'border-[#E0EDE4] bg-[#F8FAF9] text-[#1A2E23]/55 hover:border-[#00A651]/30 hover:bg-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Botao */}
      <div className="mt-8">
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl text-base font-semibold tracking-wide transition-all duration-300 ${
            isValid
              ? 'bg-white text-[#00A651] hover:bg-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.12)]'
              : 'bg-white/30 text-white/50 cursor-not-allowed'
          }`}
        >
          Continuar
          <svg className="inline-block ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
        {!isValid && totalDivisao !== 100 && (
          <p className="text-[10px] text-center text-white/30 mt-2">
            Ajuste os sliders para somar 100%
          </p>
        )}
      </div>
    </div>
  );
}
