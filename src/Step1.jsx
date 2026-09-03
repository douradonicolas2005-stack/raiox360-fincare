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
      <div className="text-center mb-6">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A86A]/70 mb-3 font-semibold">
          Fincare &mdash; Engenharia Patrimonial
        </p>
        <h1 className="text-2xl md:text-[30px] font-bold text-[#E2E8F0] leading-tight mb-3">
          Organize os bens. Entenda os custos. Planeje sua renda.
        </h1>
        <p className="text-sm text-[#8AA59A] max-w-md mx-auto">
          Descubra em 3 minutos o que levar em conta em imoveis, investimentos e impostos antes de qualquer decisao
        </p>
      </div>

      {/* 3 pilares de valor */}
      <div className="grid grid-cols-1 gap-2 mb-6">
        <div className="bg-[#16382D] rounded-xl px-4 py-3 border border-[#1F4A3A] flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-[#C9A86A]/15 text-[#C9A86A] text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
          <div>
            <p className="text-xs font-semibold text-[#E2E8F0]">Organize os bens</p>
            <p className="text-[11px] text-[#8AA59A]">Mapeie imoveis, investimentos e participacoes</p>
          </div>
        </div>
        <div className="bg-[#16382D] rounded-xl px-4 py-3 border border-[#1F4A3A] flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-[#C9A86A]/15 text-[#C9A86A] text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
          <div>
            <p className="text-xs font-semibold text-[#E2E8F0]">Entenda os custos</p>
            <p className="text-[11px] text-[#8AA59A]">Inventario, impostos e juros que corroem o patrimonio</p>
          </div>
        </div>
        <div className="bg-[#16382D] rounded-xl px-4 py-3 border border-[#1F4A3A] flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-[#C9A86A]/15 text-[#C9A86A] text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
          <div>
            <p className="text-xs font-semibold text-[#E2E8F0]">Planeje sua renda</p>
            <p className="text-[11px] text-[#8AA59A]">Estrategias para gerar renda do seu patrimonio</p>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-[10px] text-[#5E7B6E] tracking-wide">
          Analise calibrada para patrimonios acima de R$ 500k &mdash; Dados 100% confidenciais
        </p>
      </div>

      <div className="space-y-4">
        {/* Patrimonio Total */}
        <div className="bg-[#16382D] rounded-2xl p-5 md:p-6 border border-[#1F4A3A] shadow-[0_2px_16px_rgba(0,0,0,0.3)]">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium text-[#8AA59A]">Patrimonio total estimado</label>
            <span className="text-lg font-bold text-[#C9A86A]">{formatCurrency(data.patrimonio)}</span>
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
            <span className="text-[10px] text-[#5E7B6E]">R$ 500k</span>
            <span className="text-[10px] text-[#5E7B6E]">R$ 10M+</span>
          </div>
        </div>

        {/* Divisao */}
        <div className="bg-[#16382D] rounded-2xl p-5 md:p-6 border border-[#1F4A3A] shadow-[0_2px_16px_rgba(0,0,0,0.3)]">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-[#8AA59A]">Divisao atual</label>
            <span className={`text-sm font-bold ${totalDivisao === 100 ? 'text-[#C9A86A]' : 'text-[#E05C6E]'}`}>
              {totalDivisao}%
            </span>
          </div>
          {totalDivisao !== 100 && (
            <p className="text-[11px] text-[#E05C6E]/70 mb-3">Os sliders devem somar 100%</p>
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
                  <span className="text-xs text-[#8AA59A]">{label}</span>
                  <span className="text-sm font-semibold text-[#C9A86A]">{data.divisao[key]}%</span>
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
          <div className="flex h-1.5 rounded-full overflow-hidden mt-4 bg-[#1F4A3A]">
            <div className="bg-[#C9A86A]/70 transition-all duration-300" style={{ width: `${data.divisao.imoveis}%` }} />
            <div className="bg-[#00A651]/60 transition-all duration-300" style={{ width: `${data.divisao.banco}%` }} />
            <div className="bg-[#C9A86A]/40 transition-all duration-300" style={{ width: `${data.divisao.investimentos}%` }} />
            <div className="bg-[#00A651]/30 transition-all duration-300" style={{ width: `${data.divisao.empresa}%` }} />
          </div>
        </div>

        {/* Estrutura Atual */}
        <div className="bg-[#16382D] rounded-2xl p-5 md:p-6 border border-[#1F4A3A] shadow-[0_2px_16px_rgba(0,0,0,0.3)]">
          <label className="text-sm font-medium text-[#8AA59A] block mb-3">Estrutura atual</label>
          <div className="space-y-2">
            {['Tudo na PF', 'Parte em PJ', 'Tenho Holding'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect('estrutura', opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                  data.estrutura === opt
                    ? 'border-[#C9A86A] bg-[#C9A86A]/10 text-[#C9A86A] font-medium'
                    : 'border-[#1F4A3A] bg-[#122E25] text-[#8AA59A] hover:border-[#C9A86A]/30 hover:bg-[#16382D]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Maior Dor */}
        <div className="bg-[#16382D] rounded-2xl p-5 md:p-6 border border-[#1F4A3A] shadow-[0_2px_16px_rgba(0,0,0,0.3)]">
          <label className="text-sm font-medium text-[#8AA59A] block mb-3">Maior dor hoje</label>
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
                    ? 'border-[#C9A86A] bg-[#C9A86A]/10 text-[#C9A86A] font-medium'
                    : 'border-[#1F4A3A] bg-[#122E25] text-[#8AA59A] hover:border-[#C9A86A]/30 hover:bg-[#16382D]'
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
              ? 'bg-[#C9A86A] text-[#0C2017] hover:bg-[#D9BB82] shadow-[0_4px_20px_rgba(201,168,106,0.25)]'
              : 'bg-[#2A5445]/50 text-[#5E7B6E] cursor-not-allowed'
          }`}
        >
          Continuar
          <svg className="inline-block ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
        {!isValid && totalDivisao !== 100 && (
          <p className="text-[10px] text-center text-[#5E7B6E] mt-2">
            Ajuste os sliders para somar 100%
          </p>
        )}
      </div>
    </div>
  );
}
