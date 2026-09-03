import { useState, useCallback } from 'react';

function sanitizePhone(value) {
  return value.replace(/[^\d+]/g, '');
}

function validatePhone(raw) {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('55') && digits.length >= 12 && digits.length <= 14) return true;
  if (digits.length >= 10 && digits.length <= 11) return true;
  return false;
}

function formatPhoneDisplay(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('55')) {
    const local = digits.slice(2);
    if (local.length === 11) {
      return `+55 (${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
    }
    if (local.length === 10) {
      return `+55 (${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
    }
    return value;
  }
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return value;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateName(name) {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 && parts.every(p => p.length >= 2);
}

export default function Step2({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleField = useCallback((field, value) => {
    onChange({ ...data, [field]: value });
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [data, onChange, touched]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const newErrors = {};
    if (field === 'nome' && !validateName(data.nome)) {
      newErrors.nome = 'Informe nome e sobrenome';
    }
    if (field === 'email' && !validateEmail(data.email)) {
      newErrors.email = 'E-mail invalido';
    }
    if (field === 'whatsapp') {
      const raw = sanitizePhone(data.whatsapp);
      if (!validatePhone(raw)) {
        newErrors.whatsapp = 'Telefone invalido';
      }
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, [data]);

  const handlePhoneChange = useCallback((value) => {
    const raw = sanitizePhone(value);
    handleField('whatsapp', raw);
  }, [handleField]);

  const isValid =
    validateName(data.nome) &&
    validateEmail(data.email) &&
    validatePhone(sanitizePhone(data.whatsapp)) &&
    data.consentContato &&
    data.consentPrivacidade;

  const handleSubmit = () => {
    const newErrors = {};
    if (!validateName(data.nome)) newErrors.nome = 'Informe nome e sobrenome';
    if (!validateEmail(data.email)) newErrors.email = 'E-mail invalido';
    if (!validatePhone(sanitizePhone(data.whatsapp))) newErrors.whatsapp = 'Telefone invalido';
    if (!data.consentContato) newErrors.consentContato = 'Necessario para prosseguir';
    if (!data.consentPrivacidade) newErrors.consentPrivacidade = 'Necessario para prosseguir';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ nome: true, email: true, whatsapp: true, consentContato: true, consentPrivacidade: true });
      return;
    }

    onNext();
  };

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A86A]/50 mb-3 font-medium">
          Fincare &mdash; Engenharia Patrimonial
        </p>
        <h1 className="text-2xl md:text-[28px] font-bold text-[#E8E4DD] leading-tight mb-3">
          Quase lá. Precisamos dos seus dados
        </h1>
        <p className="text-sm text-[#E8E4DD]/40 max-w-md mx-auto leading-relaxed">
          Seu Raio-X Patrimonial sera gerado de forma <span className="text-[#C9A86A]/80">100% confidencial</span>. Precisamos apenas para enviar o relatório e agendar sua análise.
        </p>
      </div>

      <div className="space-y-5">
        {/* Dados Pessoais */}
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-5 md:p-6">
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#C9A86A]/60 mb-5">
            Dados pessoais
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#E8E4DD]/50 mb-1.5 block">Nome completo</label>
              <input
                type="text"
                placeholder="Seu nome e sobrenome"
                value={data.nome}
                onChange={(e) => handleField('nome', e.target.value)}
                onBlur={() => handleBlur('nome')}
                className={`w-full px-4 py-3 bg-[#060606] border rounded-lg text-sm text-[#E8E4DD] focus:outline-none transition-colors ${
                  errors.nome && touched.nome
                    ? 'border-[#8B2E2E]/60 focus:border-[#8B2E2E]'
                    : 'border-[#1E1E1E] focus:border-[#C9A86A]/40'
                }`}
              />
              {errors.nome && touched.nome && (
                <p className="text-[11px] text-[#8B2E2E]/80 mt-1">{errors.nome}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-[#E8E4DD]/50 mb-1.5 block">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={data.email}
                onChange={(e) => handleField('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 py-3 bg-[#060606] border rounded-lg text-sm text-[#E8E4DD] focus:outline-none transition-colors ${
                  errors.email && touched.email
                    ? 'border-[#8B2E2E]/60 focus:border-[#8B2E2E]'
                    : 'border-[#1E1E1E] focus:border-[#C9A86A]/40'
                }`}
              />
              {errors.email && touched.email && (
                <p className="text-[11px] text-[#8B2E2E]/80 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-[#E8E4DD]/50 mb-1.5 block">WhatsApp</label>
              <input
                type="tel"
                placeholder="(11) 99999-0000 ou +55..."
                value={data.whatsapp ? formatPhoneDisplay(data.whatsapp) : ''}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={() => handleBlur('whatsapp')}
                className={`w-full px-4 py-3 bg-[#060606] border rounded-lg text-sm text-[#E8E4DD] focus:outline-none transition-colors ${
                  errors.whatsapp && touched.whatsapp
                    ? 'border-[#8B2E2E]/60 focus:border-[#8B2E2E]'
                    : 'border-[#1E1E1E] focus:border-[#C9A86A]/40'
                }`}
              />
              {errors.whatsapp && touched.whatsapp && (
                <p className="text-[11px] text-[#8B2E2E]/80 mt-1">{errors.whatsapp}</p>
              )}
              <p className="text-[10px] text-[#E8E4DD]/20 mt-1">
                Aceitamos: (DDD) 9XXXX-XXXX, +55(DDD)9XXXX-XXXX, formatos internacionais
              </p>
            </div>
          </div>
        </div>

        {/* Permissões de Contato */}
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-5 md:p-6">
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#C9A86A]/60 mb-5">
            Permissoes de contato
          </h3>

          <div className="space-y-4">
            {/* Consentimento obrigatório - Contato */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={data.consentContato || false}
                  onChange={(e) => handleField('consentContato', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  data.consentContato
                    ? 'bg-[#C9A86A] border-[#C9A86A]'
                    : errors.consentContato
                      ? 'border-[#8B2E2E]/60 bg-[#060606]'
                      : 'border-[#1E1E1E] bg-[#060606] group-hover:border-[#C9A86A]/20'
                }`}>
                  {data.consentContato && (
                    <svg className="w-3 h-3 text-[#060606]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-[#E8E4DD]/50 leading-relaxed">
                <span className="text-[#E8E4DD]/70 font-medium">Obrigatorio:</span> Autorizo o contato da <span className="text-[#C9A86A]/70">Fincare</span> via WhatsApp e/ou e-mail para envio do Raio-X Patrimonial e agendamento de analise patrimonial confidencial.
              </span>
            </label>
            {errors.consentContato && touched.consentContato && (
              <p className="text-[11px] text-[#8B2E2E]/80 -mt-2 ml-8">{errors.consentContato}</p>
            )}

            {/* Consentimento obrigatório - Privacidade */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={data.consentPrivacidade || false}
                  onChange={(e) => handleField('consentPrivacidade', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  data.consentPrivacidade
                    ? 'bg-[#C9A86A] border-[#C9A86A]'
                    : errors.consentPrivacidade
                      ? 'border-[#8B2E2E]/60 bg-[#060606]'
                      : 'border-[#1E1E1E] bg-[#060606] group-hover:border-[#C9A86A]/20'
                }`}>
                  {data.consentPrivacidade && (
                    <svg className="w-3 h-3 text-[#060606]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-[#E8E4DD]/50 leading-relaxed">
                <span className="text-[#E8E4DD]/70 font-medium">Obrigatorio:</span> Li e concordo com a{' '}
                <span className="text-[#C9A86A]/70 underline underline-offset-2">Politica de Privacidade</span> da Fincare. Meus dados serao tratados conforme a LGPD (Lei 13.709/2018) e utilizados exclusivamente para a prestacao dos servicos de engenharia patrimonial.
              </span>
            </label>
            {errors.consentPrivacidade && touched.consentPrivacidade && (
              <p className="text-[11px] text-[#8B2E2E]/80 -mt-2 ml-8">{errors.consentPrivacidade}</p>
            )}

            {/* Consentimento opcional - Marketing */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={data.consentMarketing || false}
                  onChange={(e) => handleField('consentMarketing', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  data.consentMarketing
                    ? 'bg-[#C9A86A] border-[#C9A86A]'
                    : 'border-[#1E1E1E] bg-[#060606] group-hover:border-[#C9A86A]/20'
                }`}>
                  {data.consentMarketing && (
                    <svg className="w-3 h-3 text-[#060606]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-[#E8E4DD]/50 leading-relaxed">
                <span className="text-[#E8E4DD]/40">Opcional:</span> Desejo receber conteudos exclusivos da Fincare sobre investimentos, planejamento patrimonial e oportunidades de mercado.
              </span>
            </label>
          </div>

          {/* LGPD Info */}
          <div className="mt-5 pt-4 border-t border-[#1E1E1E]">
            <p className="text-[10px] text-[#E8E4DD]/20 leading-relaxed">
              Em conformidade com a LGPD (Lei 13.709/2018), seus dados pessoais sao de responsabilidade da Fincare Servicos Financeiros Ltda. e serao utilizados exclusivamente para a finalidade declarada. Voce pode solicitar exclusao, correcao ou acesso aos seus dados a qualquer momento pelo e-mail privacidade@fincare.com.br.
            </p>
          </div>
        </div>
      </div>

      {/* Botão */}
      <div className="mt-8">
        <button
          onClick={handleSubmit}
          className={`w-full py-4 rounded-xl text-base font-semibold tracking-wide transition-all duration-300 ${
            isValid
              ? 'bg-[#C9A86A] text-[#060606] hover:bg-[#d4b87a] shadow-[0_0_30px_rgba(201,168,106,0.15)]'
              : 'bg-[#1E1E1E] text-[#E8E4DD]/25 cursor-not-allowed'
          }`}
        >
          Ver meu Raio-X Patrimonial
          <svg className="inline-block ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
        {!isValid && (
          <p className="text-[10px] text-center text-[#E8E4DD]/15 mt-2">
            Preencha todos os campos obrigatorios e aceite os termos
          </p>
        )}
      </div>
    </div>
  );
}
