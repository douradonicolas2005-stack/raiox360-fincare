export function calcularVazamentos(data) {
  const patrimonio = data.patrimonio;
  const pctBanco = data.divisao.banco / 100;
  const pctImoveis = data.divisao.imoveis / 100;

  const valorBanco = patrimonio * pctBanco;

  const perdaAtual = (valorBanco * 0.12 * 0.15) + (valorBanco * 0.015);
  const perdaOtimizada = valorBanco * 0.112 * 0.02;
  const economiaImpostoAno = perdaAtual - perdaOtimizada;
  const economiaImposto5Anos = economiaImpostoAno * 5;

  const custoInventarioPF = patrimonio * 0.08;
  const custoHolding = 18000;
  const economiaInventario = custoInventarioPF - custoHolding;

  const temMuitosImoveis = pctImoveis > 0.30;
  const custoFinanciamento = temMuitosImoveis ? 412000 : 0;
  const custoConsorcio = temMuitosImoveis ? 64000 : 0;
  const economiaJuros = custoFinanciamento - custoConsorcio;

  const economiaTotal5Anos = economiaImposto5Anos + economiaInventario + economiaJuros;

  const anosAtuais = 18;
  const anosReduzido = Math.max(5, Math.round(anosAtuais - (economiaTotal5Anos / (patrimonio * 0.15))));

  return {
    imposto: {
      valorBanco,
      perdaAtual,
      perdaOtimizada,
      economiaAno: economiaImpostoAno,
      economia5Anos: economiaImposto5Anos,
    },
    inventario: {
      custoPF: custoInventarioPF,
      custoHolding,
      economia: economiaInventario,
      tempoPF: '18 a 24 meses',
      tempoHolding: '45 a 60 dias',
    },
    juros: {
      temFinanciamento: temMuitosImoveis,
      custoFinanciamento,
      custoConsorcio,
      economia: economiaJuros,
    },
    total: {
      economia5Anos: economiaTotal5Anos,
      anosAtuais,
      anosReduzido,
    },
    patrimonio,
    pctImoveis,
    pctBanco,
  };
}

export function formatarMoeda(valor) {
  if (valor >= 1000000) {
    return `R$ ${(valor / 1000000).toFixed(1)}M`.replace('.0M', 'M');
  }
  return `R$ ${(valor / 1000).toFixed(0)}k`.replace('k', 'k');
}

export function formatarMoedaCompleto(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
