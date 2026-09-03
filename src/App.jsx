import { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import { calcularVazamentos } from './calculations';

const INITIAL_DATA = {
  patrimonio: 2000000,
  divisao: { imoveis: 40, banco: 30, investimentos: 20, empresa: 10 },
  estrutura: '',
  maiorDor: '',
};

const INITIAL_LEAD = {
  nome: '',
  whatsapp: '',
  email: '',
  consentContato: false,
  consentPrivacidade: false,
  consentMarketing: false,
};

const STORAGE_KEY = 'fincare_raioxpatrimonial';

function loadSaved() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* silent */ }
  return null;
}

export default function App() {
  const saved = loadSaved();
  const [step, setStep] = useState(saved?.step || 1);
  const [formData, setFormData] = useState(saved?.formData || INITIAL_DATA);
  const [leadData, setLeadData] = useState(saved?.leadData || INITIAL_LEAD);
  const [resultados, setResultados] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, formData, leadData }));
  }, [step, formData, leadData]);

  const handleDiagnosticNext = () => {
    const calc = calcularVazamentos(formData);
    setResultados(calc);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactNext = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResultsNext = () => {
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setStep(1);
    setFormData(INITIAL_DATA);
    setLeadData(INITIAL_LEAD);
    setResultados(null);
    localStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = ['Diagnostico', 'Contato', 'Resultado', 'Mapa'];

  return (
    <div className="min-h-screen bg-[#00A651]">
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-[#00A651]/95 backdrop-blur-md border-b border-white/15">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/80 font-semibold">
                Fincare
              </span>
            </div>
            <span className="text-[10px] text-white/40">
              Etapa {step} de 4
            </span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={`h-[3px] rounded-full transition-all duration-700 ease-out ${
                    s <= step ? 'bg-white' : 'bg-white/20'
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {steps.map((label, i) => (
              <span
                key={i}
                className={`text-[8px] tracking-[0.15em] uppercase transition-colors duration-500 ${
                  i + 1 <= step ? 'text-white/70' : 'text-white/25'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        {step === 1 && (
          <Step1 data={formData} onChange={setFormData} onNext={handleDiagnosticNext} />
        )}
        {step === 2 && (
          <Step2 data={leadData} onChange={setLeadData} onNext={handleContactNext} />
        )}
        {step === 3 && resultados && (
          <Step3 resultados={resultados} onNext={handleResultsNext} />
        )}
        {step === 4 && resultados && (
          <Step4
            resultados={resultados}
            formData={formData}
            leadData={leadData}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Disclaimer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-1">
          <p className="text-[9px] text-white/30 text-center leading-relaxed">
            Simulacao educativa com base em medias de mercado. Nao constitui recomendacao juridica ou tributaria. Valide com advogado e contador.
          </p>
          <p className="text-[9px] text-white/20 text-center">
            Fincare Servicos Financeiros Ltda. | CNPJ 00.000.000/0001-00
          </p>
        </div>
      </footer>
    </div>
  );
}
