import { useState } from 'react';

/* ---------- Icones isometricos (diorama) ---------- */

function IconPatrimonio({ className }) {
  return (
    <svg className={className} viewBox="0 0 96 96" fill="none">
      {/* base ground */}
      <polygon points="48,70 20,56 48,42 76,56" fill="#1F4A3A" />
      {/* moedas empilhadas */}
      <g>
        <ellipse cx="48" cy="52" rx="16" ry="8" fill="#C9A86A" />
        <ellipse cx="48" cy="47" rx="16" ry="8" fill="#E0C58E" />
        <ellipse cx="48" cy="42" rx="16" ry="8" fill="#C9A86A" />
      </g>
      {/* detalhe cifrao */}
      <text x="48" y="46" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0C2017">R$</text>
      {/* seta de valor */}
      <path d="M18 74 h60" stroke="#00A651" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 70 l8 4 -8 4 z" fill="#00A651" />
    </svg>
  );
}

function IconDivisao({ className }) {
  return (
    <svg className={className} viewBox="0 0 96 96" fill="none">
      {/* terreno */}
      <polygon points="48,66 16,51 48,36 80,51" fill="#1F4A3A" />
      {/* predio esquerda (imovel) */}
      <rect x="30" y="30" width="16" height="24" fill="#C9A86A" />
      <rect x="33" y="24" width="10" height="8" fill="#C9A86A" />
      <polygon points="28,30 48,20 68,30 48,40" fill="#E0C58E" />
      {/* acoes/fundo direita */}
      <rect x="54" y="38" width="14" height="16" fill="#00A651" />
      <path d="M58 50 l4 -6 4 4 4 -5" stroke="#0C2017" strokeWidth="2" fill="none" />
      {/* separador */}
      <path d="M48 24 v44" stroke="#5E7B6E" strokeWidth="1" strokeDasharray="3,3" />
    </svg>
  );
}

function IconEstrutura({ className }) {
  return (
    <svg className={className} viewBox="0 0 96 96" fill="none">
      {/* terreno */}
      <polygon points="48,70 20,56 48,42 76,56" fill="#1F4A3A" />
      {/* holding - caixa com tampa */}
      <rect x="32" y="34" width="32" height="22" fill="#C9A86A" />
      <polygon points="30,34 48,26 66,34 48,42" fill="#E0C58E" />
      <rect x="44" y="42" width="8" height="14" fill="#0C2017" opacity="0.3" />
      {/* engrenagem/engrenar */}
      <circle cx="64" cy="22" r="5" fill="#00A651" />
      <path d="M64 12 l1.5 3 3 -1.5 -1 3 3.2 0 -1 3 3 -1.5 0 3.2 -3 -1.5 -1.5 3 -1.5 -3 -3 1.5 1 -3 -3.2 0 1 -3 -3 1.5 0 -3.2 3 1.5 z" fill="#00A651" />
    </svg>
  );
}

function IconDor({ className }) {
  return (
    <svg className={className} viewBox="0 0 96 96" fill="none">
      {/* terreno */}
      <polygon points="48,72 18,57 48,42 78,57" fill="#1F4A3A" />
      {/* coracao/alvo */}
      <circle cx="48" cy="46" r="16" fill="#E05C6E" opacity="0.35" />
      <circle cx="48" cy="46" r="10" fill="#E05C6E" />
      <circle cx="48" cy="46" r="4" fill="#0C2017" />
      {/* raios de foco */}
      <path d="M48 24 v-6 M48 68 v6 M28 46 h-6 M68 46 h6" stroke="#C9A86A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Config das etapas ---------- */

const SUB_STEPS = [
  {
    id: 'patrimonio',
    badgetxt: 'Patrimonio total',
    titulo: 'Quanto vale, hoje, o seu patrimonio?',
    descricao: 'Some o valor de mercado dos seus bens. Este e o ponto de partida da analise.',
    icon: IconPatrimonio,
    label: 'Patrimonio total estimado',
  },
  {
    id: 'divisao',
    badgetxt: 'Divisao dos bens',
    titulo: 'Como o seu patrimonio esta distribuido?',
    descricao: 'A forma como os bens estao divididos define onde esta o maior vazamento.',
    icon: IconDivisao,
  },
  {
    id: 'estrutura',
    badgetxt: 'Estrutura atual',
    titulo: 'Qual estrutura voce usa hoje?',
    descricao: 'A estrutura juridica dos bens muda completamente os impostos e custos.',
    icon: IconEstrutura,
  },
  {
    id: 'dor',
    badgetxt: 'Maior dor',
    titulo: 'O que mais te preocupa hoje?',
    descricao: 'Sua prioridade direciona o mapa de engenharia patrimonial.',
    icon: IconDor,
  },
];

export default function Step1({ data, onChange, onNext }) {
  const [subStep, setSubStep] = useState(0);
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

  const step = SUB_STEPS[subStep];
  const Icon = step.icon;
  const isLast = subStep === SUB_STEPS.length - 1;

  const canNext =
    (subStep === 0) ||
    (subStep === 1 && totalDivisao === 100) ||
    (subStep === 2 && data.estrutura) ||
    (subStep === 3 && data.maiorDor);

  const handleNext = () => {
    if (!canNext) return;
    if (isLast) {
      onNext();
    } else {
      setSubStep(subStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (subStep > 0) {
      setSubStep(subStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-6">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A86A]/70 mb-3 font-semibold">
          Fincare &mdash; Engenharia Patrimonial
        </p>
        <h1 className="text-2xl md:text-[30px] font-bold text-[#E2E8F0] leading-tight mb-3">
          Pergunta {subStep + 1} de {SUB_STEPS.length}
        </h1>
        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-[#C9A86A]/80 bg-[#C9A86A]/10 border border-[#C9A86A]/30 rounded-full px-3 py-1 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />
          {step.badgetxt}
        </span>
        <p className="text-[10px] text-[#5E7B6E] mt-3 tracking-wide">
          Etapa 1 &mdash; Organize os bens. Entenda os custos. Planeje sua renda.
        </p>
      </div>

      {/* Indicador de progresso das perguntas */}
      <div className="flex gap-1 mb-6">
        {SUB_STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`flex-1 h-1 rounded-full transition-all duration-500 ${
              i < subStep ? 'bg-[#C9A86A]' : i === subStep ? 'bg-[#C9A86A]/60' : 'bg-[#1F4A3A]'
            }`}
          />
        ))}
      </div>

      {/* Card da pergunta com icone ao lado */}
      <div className="bg-[#16382D] rounded-2xl p-5 md:p-6 border border-[#1F4A3A] shadow-[0_2px_16px_rgba(0,0,0,0.3)]">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl bg-[#122E25] border border-[#1F4A3A] flex items-center justify-center">
            <Icon className="w-full h-full" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#E2E8F0] leading-snug mb-1">
              {step.titulo}
            </h2>
            <p className="text-xs text-[#8AA59A] leading-relaxed">{step.descricao}</p>
          </div>
        </div>

        {/* Conteudo por etapa */}
        {subStep === 0 && (
          <div className="ml-0 md:ml-28">
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
        )}

        {subStep === 1 && (
          <div className="ml-0 md:ml-28">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-[#8AA59A]">Divisao atual</label>
              <span className={`text-sm font-bold ${totalDivisao === 100 ? 'text-[#C9A86A]' : 'text-[#E05C6E]'}`}>
                {totalDivisao}%
              </span>
            </div>
            {totalDivisao !== 100 && (
              <p className="text-[11px] text-[#E05C6E]/70 mb-3">Os sliders devem somar 100%</p>
            )}
            <div className="space-y-5">
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
            <div className="flex h-1.5 rounded-full overflow-hidden mt-4 bg-[#1F4A3A]">
              <div className="bg-[#C9A86A]/70 transition-all duration-300" style={{ width: `${data.divisao.imoveis}%` }} />
              <div className="bg-[#00A651]/60 transition-all duration-300" style={{ width: `${data.divisao.banco}%` }} />
              <div className="bg-[#C9A86A]/40 transition-all duration-300" style={{ width: `${data.divisao.investimentos}%` }} />
              <div className="bg-[#00A651]/30 transition-all duration-300" style={{ width: `${data.divisao.empresa}%` }} />
            </div>
          </div>
        )}

        {subStep === 2 && (
          <div className="ml-0 md:ml-28 space-y-2">
            {['Tudo na PF', 'Parte em PJ', 'Tenho Holding'].map((opt) => (
              <button
                key={opt}
                onClick={() => { handleSelect('estrutura', opt); }}
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
        )}

        {subStep === 3 && (
          <div className="ml-0 md:ml-28 space-y-2">
            {[
              'Pagar menos imposto',
              'Proteger para filhos',
              'Parar de pagar juros',
              'Diversificar fora do Brasil',
            ].map((opt) => (
              <button
                key={opt}
                onClick={() => { handleSelect('maiorDor', opt); }}
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
        )}
      </div>

      {/* Navegacao */}
      <div className="mt-6 flex items-center gap-3">
        {subStep > 0 ? (
          <button
            onClick={handleBack}
            className="px-5 py-4 rounded-2xl text-sm font-semibold text-[#8AA59A] bg-[#16382D] border border-[#1F4A3A] hover:bg-[#1B4235] transition-all duration-300"
          >
            Voltar
          </button>
        ) : <div className="w-[96px]" />}
        <button
          onClick={handleNext}
          disabled={!canNext}
          className={`flex-1 py-4 rounded-2xl text-base font-semibold tracking-wide transition-all duration-300 ${
            canNext
              ? 'bg-[#C9A86A] text-[#0C2017] hover:bg-[#D9BB82] shadow-[0_4px_20px_rgba(201,168,106,0.25)]'
              : 'bg-[#2A5445]/50 text-[#5E7B6E] cursor-not-allowed'
          }`}
        >
          {isLast ? 'Gerar meu Raio-X' : 'Proxima pergunta'}
          <svg className="inline-block ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {!canNext && subStep === 1 && totalDivisao !== 100 && (
        <p className="text-[10px] text-center text-[#5E7B6E] mt-2">
          Ajuste os sliders para somar 100%
        </p>
      )}
    </div>
  );
}
