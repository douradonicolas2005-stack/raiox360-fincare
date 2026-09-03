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
    if (local.length === 11) return `+55 (${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
    if (local.length === 10) return `+55 (${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
    return value;
  }
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
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
    if (field === 'nome' && !validateName(data.nome)) newErrors.nome = 'Informe nome e sobrenome';
    if (field === 'email' && !validateEmail(data.email)) newErrors.email = 'E-mail invalido';
    if (field === 'whatsapp' && !validatePhone(sanitizePhone(data.whatsapp))) newErrors.whatsapp = 'Telefone invalido';
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, [data]);

  const handlePhoneChange = useCallback((value) => {
    handleField('whatsapp', sanitizePhone(value));
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

  const inputBase = "w-full px-4 py-3 bg-[#122E25] border rounded-xl text-sm text-[#E2E8F0] focus:outline-none transition-colors";

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A86A]/70 mb-3 font-semibold">
          Fincare &mdash; Engenharia Patrimonial
        </p>
        <h1 className="text-2xl md:text-[28px] font-bold text-[#E2E8F0] leading-tight mb-3">
          Sua heranca. Seu proximo passo.
        </h1>
        <p className="text-sm text-[#8AA59A] max-w-md mx-auto leading-relaxed">
          Precisamos dos seus dados para montar o seu Raio-X completo e agendar sua analise patrimonial confidencial.
        </p>
      </div>

      <div className="space-y-5">
        {/* Dados Pessoais */}
        <div className="bg-[#16382D] rounded-2xl p-5 md:p-6 border border-[#1F4A3A] shadow-[0_2px_16px_rgba(0,0,0,0.3)]">
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#C9A86A] mb-5">
            Dados pessoais
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#8AA59A] mb-1.5 block">Nome completo</label>
              <input
                type="text"
                placeholder="Seu nome e sobrenome"
                value={data.nome}
                onChange={(e) => handleField('nome', e.target.value)}
                onBlur={() => handleBlur('nome')}
                className={`${inputBase} ${
                  errors.nome && touched.nome
                    ? 'border-[#E05C6E]/50 focus:border-[#E05C6E]'
                    : 'border-[#1F4A3A] focus:border-[#C9A86A]'
                }`}
              />
              {errors.nome && touched.nome && (
                <p className="text-[11px] text-[#E05C6E]/80 mt-1">{errors.nome}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-[#8AA59A] mb-1.5 block">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={data.email}
                onChange={(e) => handleField('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`${inputBase} ${
                  errors.email && touched.email
                    ? 'border-[#E05C6E]/50 focus:border-[#E05C6E]'
                    : 'border-[#1F4A3A] focus:border-[#C9A86A]'
                }`}
              />
              {errors.email && touched.email && (
                <p className="text-[11px] text-[#E05C6E]/80 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-[#8AA59A] mb-1.5 block">WhatsApp</label>
              <input
                type="tel"
                placeholder="(11) 99999-0000 ou +55..."
                value={data.whatsapp ? formatPhoneDisplay(data.whatsapp) : ''}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={() => handleBlur('whatsapp')}
                className={`${inputBase} ${
                  errors.whatsapp && touched.whatsapp
                    ? 'border-[#E05C6E]/50 focus:border-[#E05C6E]'
                    : 'border-[#1F4A3A] focus:border-[#C9A86A]'
                }`}
              />
              {errors.whatsapp && touched.whatsapp && (
                <p className="text-[11px] text-[#E05C6E]/80 mt-1">{errors.whatsapp}</p>
              )}
              <p className="text-[10px] text-[#5E7B6E] mt-1">
                Aceitamos: (DDD) 9XXXX-XXXX, +55(DDD)9XXXX-XXXX, formatos internacionais
              </p>
            </div>
          </div>
        </div>

        {/* Permissoes */}
        <div className="bg-[#16382D] rounded-2xl p-5 md:p-6 border border-[#1F4A3A] shadow-[0_2px_16px_rgba(0,0,0,0.3)]">
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#C9A86A] mb-5">
            Permissoes de contato
          </h3>

          <div className="space-y-4">
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
                      ? 'border-[#E05C6E]/50 bg-[#122E25]'
                      : 'border-[#3A6450] bg-[#122E25] group-hover:border-[#C9A86A]/40'
                }`}>
                  {data.consentContato && (
                    <svg className="w-3 h-3 text-[#0C2017]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-[#8AA59A] leading-relaxed">
                <span className="text-[#E2E8F0] font-medium">Obrigatorio:</span> Autorizo o contato da <span className="text-[#C9A86A] font-medium">Fincare</span> via WhatsApp e/ou e-mail para envio do Raio-X Patrimonial e agendamento de analise patrimonial confidencial.
              </span>
            </label>
            {errors.consentContato && touched.consentContato && (
              <p className="text-[11px] text-[#E05C6E]/80 -mt-2 ml-8">{errors.consentContato}</p>
            )}

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
                      ? 'border-[#E05C6E]/50 bg-[#122E25]'
                      : 'border-[#3A6450] bg-[#122E25] group-hover:border-[#C9A86A]/40'
                }`}>
                  {data.consentPrivacidade && (
                    <svg className="w-3 h-3 text-[#0C2017]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-[#8AA59A] leading-relaxed">
                <span className="text-[#E2E8F0] font-medium">Obrigatorio:</span> Li e concordo com a{' '}
                <span className="text-[#C9A86A] underline underline-offset-2">Politica de Privacidade</span> da Fincare. Meus dados serao tratados conforme a LGPD (Lei 13.709/2018) e utilizados exclusivamente para a prestacao dos servicos de engenharia patrimonial.
              </span>
            </label>
            {errors.consentPrivacidade && touched.consentPrivacidade && (
              <p className="text-[11px] text-[#E05C6E]/80 -mt-2 ml-8">{errors.consentPrivacidade}</p>
            )}

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
                    : 'border-[#3A6450] bg-[#122E25] group-hover:border-[#C9A86A]/40'
                }`}>
                  {data.consentMarketing && (
                    <svg className="w-3 h-3 text-[#0C2017]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-[#8AA59A] leading-relaxed">
                <span className="text-[#5E7B6E]">Opcional:</span> Desejo receber conteudos exclusivos da Fincare sobre investimentos, planejamento patrimonial e oportunidades de mercado.
              </span>
            </label>
          </div>

          <div className="mt-5 pt-4 border-t border-[#1F4A3A]">
            <p className="text-[10px] text-[#5E7B6E] leading-relaxed">
              Em conformidade com a LGPD (Lei 13.709/2018), seus dados pessoais sao de responsabilidade da Fincare Servicos Financeiros Ltda. e serao utilizados exclusivamente para a finalidade declarada. Voce pode solicitar exclusao, correcao ou acesso aos seus dados a qualquer momento pelo e-mail privacidade@fincare.com.br.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleSubmit}
          className={`w-full py-4 rounded-2xl text-base font-semibold tracking-wide transition-all duration-300 ${
            isValid
              ? 'bg-[#C9A86A] text-[#0C2017] hover:bg-[#D9BB82] shadow-[0_4px_20px_rgba(201,168,106,0.25)]'
              : 'bg-[#2A5445]/50 text-[#5E7B6E] cursor-not-allowed'
          }`}
        >
          Ver meu Raio-X Patrimonial
          <svg className="inline-block ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
        {!isValid && (
          <p className="text-[10px] text-center text-[#5E7B6E] mt-2">
            Preencha todos os campos obrigatorios e aceite os termos
          </p>
        )}
      </div>
    </div>
  );
}
