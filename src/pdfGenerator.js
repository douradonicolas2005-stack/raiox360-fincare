import jsPDF from 'jspdf';

export function gerarPDF(resultados, formData, leadData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = 210;
  const pageH = 297;
  const margin = 16;
  const contentW = pageW - margin * 2;
  let y = 0;

  const GREEN = [0, 166, 81];
  const GOLD = [184, 134, 11];
  const RED = [220, 53, 69];
  const BG = [15, 51, 40];
  const DARK_BG = [13, 25, 15];
  const CARD_BG = [255, 255, 255];
  const BORDER = [220, 230, 222];
  const TEXT_DARK = [26, 46, 35];
  const TEXT_MUTED = [90, 122, 104];

  function drawBackground() {
    doc.setFillColor(...BG);
    doc.rect(0, 0, pageW, pageH, 'F');
  }

  function drawCard(x, cardY, w, h) {
    doc.setFillColor(...CARD_BG);
    doc.roundedRect(x, cardY, w, h, 3, 3, 'F');
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, cardY, w, h, 3, 3, 'S');
  }

  function drawWhiteCard(x, cardY, w, h) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, cardY, w, h, 3, 3, 'F');
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, cardY, w, h, 3, 3, 'S');
  }

  function drawText(text, tx, ty, opts = {}) {
    const size = opts.size || 10;
    const color = opts.color || TEXT_DARK;
    const align = opts.align || 'left';
    const style = opts.style || 'normal';
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.setFont('helvetica', style);
    doc.text(text, tx, ty, { align });
  }

  function fmtCurrency(val) {
    return 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function addPage() {
    doc.addPage();
    drawBackground();
    y = margin;
  }

  // === PAGE 1 - CAPA ===
  drawBackground();

  // White header area
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, 80, 'F');

  // Accent line
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, pageW, 4, 'F');

  // Fincare branding
  drawText('fincare', margin, 20, { size: 18, color: GREEN, style: 'bold' });
  drawText('engenharia patrimonial', margin, 26, { size: 7, color: TEXT_MUTED });

  y = 42;
  drawText('RAIO-X PATRIMONIAL', margin, y, { size: 22, color: TEXT_DARK, style: 'bold' });
  y += 10;
  drawText('Diagnostico completo de vazamentos e oportunidades', margin, y, { size: 10, color: TEXT_MUTED });
  y += 12;

  // Lead info
  drawWhiteCard(margin, y, contentW, 26);
  y += 8;
  drawText(`Nome: ${leadData.nome || '---'}`, margin + 5, y, { size: 9, color: TEXT_DARK });
  drawText(`WhatsApp: ${leadData.whatsapp || '---'}`, pageW / 2 + 2, y, { size: 9, color: TEXT_DARK });
  y += 7;
  drawText(`E-mail: ${leadData.email || '---'}`, margin + 5, y, { size: 9, color: TEXT_DARK });
  drawText(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageW / 2 + 2, y, { size: 9, color: TEXT_DARK });
  y += 14;

  // Key metric card
  doc.setFillColor(...DARK_BG);
  doc.roundedRect(margin, y, contentW, 36, 3, 3, 'F');
  y += 10;
  drawText('VAZAMENTO TOTAL DETECTADO', margin + 8, y, { size: 8, color: [200, 200, 200] });
  y += 10;
  drawText(fmtCurrency(resultados.total.economia5Anos), margin + 8, y, { size: 20, color: GOLD, style: 'bold' });
  drawText('ECONOMIA EM 5 ANOS', pageW - margin - 8, y, { size: 8, color: [150, 150, 150], align: 'right' });
  y += 8;
  drawText('Auditoria patrimonial completa por Fincare Engenharia', margin + 8, y, { size: 7, color: [120, 120, 120] });
  y += 22;

  // Profile
  drawWhiteCard(margin, y, contentW, 50);
  y += 8;
  drawText('PERFIL PATRIMONIAL', margin + 5, y, { size: 9, color: GREEN, style: 'bold' });
  y += 8;
  drawText(`Patrimonio total: ${fmtCurrency(formData.patrimonio)}`, margin + 5, y, { size: 9, color: TEXT_DARK });
  drawText(`Imoveis PF: ${formData.divisao.imoveis}%`, pageW / 2 + 2, y, { size: 9, color: TEXT_DARK });
  y += 7;
  drawText(`Estrutura: ${formData.estrutura || '---'}`, margin + 5, y, { size: 9, color: TEXT_DARK });
  drawText(`Maior dor: ${formData.maiorDor || '---'}`, pageW / 2 + 2, y, { size: 9, color: TEXT_DARK });
  y += 7;
  drawText(`Divisao do patrimonio:`, margin + 5, y, { size: 8, color: TEXT_MUTED });
  y += 5;
  drawText(`${formData.divisao.imoveis}% Imoveis | ${formData.divisao.banco}% Banco | ${formData.divisao.investimentos}% Investimentos | ${formData.divisao.empresa}% Empresa`, margin + 5, y, { size: 7, color: TEXT_MUTED });
  y += 14;

  // Resumo 3 produtos
  const items = [
    { titulo: 'Imposto Invisivel', valor: fmtCurrency(resultados.imposto.economiaAno), sub: '/ano' },
    { titulo: 'Custo Inventario', valor: fmtCurrency(resultados.inventario.economia), sub: 'poupado' },
    { titulo: 'Juros Financiamento', valor: fmtCurrency(resultados.juros.economia), sub: 'economia' },
  ];
  const colW = (contentW - 8) / 3;
  items.forEach((item, i) => {
    const cx = margin + i * (colW + 4);
    drawWhiteCard(cx, y, colW, 28);
    y += 7;
    drawText(item.titulo.toUpperCase(), cx + 4, y, { size: 7, color: TEXT_MUTED });
    y += 9;
    drawText(item.valor, cx + 4, y, { size: 14, color: GREEN, style: 'bold' });
    y += 5;
    drawText(item.sub, cx + 4, y, { size: 6, color: TEXT_MUTED });
    y -= 20;
  });
  y += 30;

  // Footer
  doc.setFillColor(...BG);
  doc.rect(0, pageH - 16, pageW, 16, 'F');
  drawText('CONFIDENCIAL | Fincare Servicos Financeiros Ltda. | CNPJ 00.000.000/0001-00', pageW / 2, pageH - 6, { size: 6, color: [255, 255, 255], align: 'center' });
  drawText('Mapa patrimonial gerado por IA + validado por especialistas | Contato: contato@fincare.com.br', pageW / 2, pageH - 11, { size: 5, color: [200, 230, 210], align: 'center' });

  // === PAGE 2 - VAZAMENTOS DETALHADOS ===
  addPage();

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, 30, 'F');
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, pageW, 3, 'F');
  drawText('RAIO-X PATRIMONIAL', margin, 15, { size: 14, color: TEXT_DARK, style: 'bold' });
  drawText('Analise detalhada de vazamentos', margin, 22, { size: 8, color: TEXT_MUTED });
  y = 40;

  // Vazamento 1
  drawCard(margin, y, contentW, 58);
  doc.setFillColor(...GREEN);
  doc.rect(margin, y, 3, 58, 'F');
  drawText('VAZAMENTO 1 \u2014 Imposto Invisivel', margin + 8, y + 10, { size: 11, color: GREEN, style: 'bold' });
  drawText(`Seus ${fmtCurrency(resultados.imposto.valorBanco)} no bancao geram IR oculto de ${fmtCurrency(resultados.imposto.perdaAtual)}/ano.`, margin + 8, y + 18, { size: 8, color: TEXT_DARK });
  drawText(`Otimizado com FII + LCI isento: ${fmtCurrency(resultados.imposto.perdaOtimizada)}/ano.`, margin + 8, y + 24, { size: 8, color: TEXT_DARK });
  drawText(`Economia anual: ${fmtCurrency(resultados.imposto.economiaAno)}`, margin + 8, y + 30, { size: 9, color: GREEN, style: 'bold' });
  y += 16;
  drawText('Linha vermelha', margin + 8, y + 20, { size: 7, color: RED });
  doc.setDrawColor(...RED);
  doc.setLineWidth(1.5);
  doc.line(margin + 8, y + 22, margin + 8 + Math.min(resultados.imposto.perdaAtual / 10000, contentW - 30), y + 22);
  drawText('Linha verde', margin + 8, y + 28, { size: 7, color: GREEN });
  doc.setDrawColor(...GREEN);
  doc.line(margin + 8, y + 30, margin + 8 + Math.min(resultados.imposto.perdaOtimizada / 10000, contentW - 30), y + 30);
  y += 50;

  // Vazamento 2
  drawCard(margin, y, contentW, 58);
  doc.setFillColor(...GOLD);
  doc.rect(margin, y, 3, 58, 'F');
  drawText('VAZAMENTO 2 \u2014 Custo de Inventario', margin + 8, y + 10, { size: 11, color: GOLD, style: 'bold' });
  drawText(`Inventario PF: ${fmtCurrency(resultados.inventario.custoPF)} (${resultados.inventario.tempoPF}).`, margin + 8, y + 18, { size: 8, color: TEXT_DARK });
  drawText(`Com Holding: ${fmtCurrency(resultados.inventario.custoHolding)} (${resultados.inventario.tempoHolding}).`, margin + 8, y + 24, { size: 8, color: TEXT_DARK });
  drawText(`Economia potencial: ${fmtCurrency(resultados.inventario.economia)}`, margin + 8, y + 30, { size: 9, color: GOLD, style: 'bold' });
  y += 16;
  drawText('Linha vermelha', margin + 8, y + 20, { size: 7, color: RED });
  doc.setDrawColor(...RED);
  doc.setLineWidth(1.5);
  doc.line(margin + 8, y + 22, margin + 8 + Math.min(resultados.inventario.custoPF / 10000, contentW - 30), y + 22);
  drawText('Linha verde', margin + 8, y + 28, { size: 7, color: GREEN });
  doc.setDrawColor(...GREEN);
  doc.line(margin + 8, y + 30, margin + 8 + Math.min(resultados.inventario.custoHolding / 10000, contentW - 30), y + 30);
  y += 50;

  if (resultados.juros.temFinanciamento) {
    drawCard(margin, y, contentW, 58);
    doc.setFillColor(...GREEN);
    doc.rect(margin, y, 3, 58, 'F');
    drawText('VAZAMENTO 3 \u2014 Juros de Financiamento', margin + 8, y + 10, { size: 11, color: GREEN, style: 'bold' });
    drawText(`Financiamento bancao: ${fmtCurrency(resultados.juros.custoFinanciamento)} de juros totais.`, margin + 8, y + 18, { size: 8, color: TEXT_DARK });
    drawText(`Consorcio contemplado: ${fmtCurrency(resultados.juros.custoConsorcio)} de taxa.`, margin + 8, y + 24, { size: 8, color: TEXT_DARK });
    drawText(`Economia: ${fmtCurrency(resultados.juros.economia)} + 1 imovel extra via alavancagem.`, margin + 8, y + 30, { size: 9, color: GREEN, style: 'bold' });
    y += 16;
    drawText('Linha vermelha', margin + 8, y + 20, { size: 7, color: RED });
    doc.setDrawColor(...RED);
    doc.setLineWidth(1.5);
    doc.line(margin + 8, y + 22, margin + 8 + Math.min(resultados.juros.custoFinanciamento / 10000, contentW - 30), y + 22);
    drawText('Linha verde', margin + 8, y + 28, { size: 7, color: GREEN });
    doc.setDrawColor(...GREEN);
    doc.line(margin + 8, y + 30, margin + 8 + Math.min(resultados.juros.custoConsorcio / 10000, contentW - 30), y + 30);
    y += 50;
  }

  // Footer
  doc.setFillColor(...BG);
  doc.rect(0, pageH - 12, pageW, 12, 'F');
  drawText('Fincare Engenharia Patrimonial | Contato: contato@fincare.com.br | CNPJ 00.000.000/0001-00', pageW / 2, pageH - 5, { size: 6, color: [255, 255, 255], align: 'center' });

  // === PAGE 3 - MAPA ===
  addPage();

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, 30, 'F');
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, pageW, 3, 'F');
  drawText('MAPA DE ENGENHARIA', margin, 15, { size: 14, color: TEXT_DARK, style: 'bold' });
  drawText('Sua estrategia em 3 camadas', margin, 22, { size: 8, color: TEXT_MUTED });
  y = 40;

  const sections = [
    {
      titulo: 'PROTECAO',
      cor: GREEN,
      itens: [
        'Migrar imoveis PF para Holding patrimonial',
        'ITCMD zero na sucessao (R$ 200k-500k poupados)',
        'PGBL/VGBL com taxa 0,5% e alavancagem 4x',
        'Seguro vida resgatavel para liquidez do inventario',
      ],
    },
    {
      titulo: 'EFICIENCIA',
      cor: GOLD,
      itens: [
        `Trocar ${fmtCurrency(resultados.imposto.valorBanco)} de CDB para FII + LCI`,
        `Economia anual: ${fmtCurrency(resultados.imposto.economiaAno)}`,
        'FGTS R$ 45k como lance em consorcio',
        'Previdencia PGBL com taxa 0,5% + 15% IR no leilao',
      ],
    },
    {
      titulo: 'ALAVANCAGEM',
      cor: [0, 166, 81],
      itens: [
        '2 cartas contempladas de R$ 400k com R$ 150k',
        'Aluguel das cartas paga 80% das parcelas',
        'Patrimonio projetado: R$ 800k com entrada de R$ 150k',
        'Aluguel ativo gera R$ 3k/mes pasivo',
      ],
    },
  ];

  sections.forEach((sec) => {
    const h = 48;
    drawCard(margin, y, contentW, h);
    doc.setFillColor(...sec.cor);
    doc.rect(margin, y, 3, h, 'F');
    drawText(sec.titulo, margin + 8, y + 9, { size: 10, color: sec.cor, style: 'bold' });
    sec.itens.forEach((item, i) => {
      drawText(`${i + 1}. ${item}`, margin + 8, y + 17 + i * 8, { size: 7, color: TEXT_DARK });
    });
    y += h + 5;
  });

  // Footer
  doc.setFillColor(...BG);
  doc.rect(0, pageH - 12, pageW, 12, 'F');
  drawText('Fincare Engenharia Patrimonial | Contato: contato@fincare.com.br | CNPJ 00.000.000/0001-00', pageW / 2, pageH - 5, { size: 6, color: [255, 255, 255], align: 'center' });

  // Save
  doc.save(`raiox-patrimonial-${(leadData.nome || 'fincare').replace(/\s+/g, '-').toLowerCase()}.pdf`);
}
