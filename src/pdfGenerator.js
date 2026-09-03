import { jsPDF } from 'jspdf';
import { formatarMoedaCompleto } from './calculations';

export function gerarPDF(resultados, formData, leadData) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const bg = [11, 17, 32];
  const card = [19, 29, 48];
  const green = [0, 166, 81];
  const gold = [201, 168, 106];
  const textLight = [226, 232, 240];
  const textMuted = [122, 139, 166];
  const red = [220, 53, 69];
  const border = [28, 40, 64];

  function drawBackground() {
    doc.setFillColor(...bg);
    doc.rect(0, 0, pageW, pageH, 'F');
  }

  function drawCard(x, y, w, h) {
    doc.setFillColor(...card);
    doc.roundedRect(x, y, w, h, 2, 2, 'F');
    doc.setDrawColor(...border);
    doc.roundedRect(x, y, w, h, 2, 2, 'S');
  }

  function drawLine(y, color) {
    doc.setDrawColor(...(color || green));
    doc.setLineWidth(0.3);
    doc.line(20, y, pageW - 20, y);
  }

  let y = 22;

  drawBackground();

  // Header - Fincare
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...green);
  doc.text('FINCARE', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...textMuted);
  doc.text('Engenharia Patrimonial', 20, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...green);
  doc.text('RAIO-X PATRIMONIAL', pageW / 2, y + 2, { align: 'center' });

  y += 14;
  drawLine(y);
  y += 8;

  // Date + Client
  const dataGeracao = new Date().toLocaleDateString('pt-BR');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...textMuted);
  doc.text(`Gerado em ${dataGeracao} | ${leadData.nome || 'Confidencial'} | Relatorio Confidencial`, 20, y);
  y += 8;

  // Patrimonio
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...green);
  doc.text('PATRIMONIO ANALISADO', 20, y);
  y += 7;

  doc.setFontSize(18);
  doc.setTextColor(...textLight);
  doc.text(formatarMoedaCompleto(resultados.patrimonio), 20, y);
  y += 10;

  drawCard(20, y, pageW - 40, 32);
  y += 8;

  doc.setFontSize(7);
  doc.setTextColor(...textMuted);
  doc.text(`Divisao: ${formData.divisao.imoveis}% Imoveis | ${formData.divisao.banco}% Banco | ${formData.divisao.investimentos}% Investimentos | ${formData.divisao.empresa}% Empresa`, 26, y);
  y += 5;
  doc.text(`Estrutura: ${formData.estrutura} | Maior dor: ${formData.maiorDor}`, 26, y);
  y += 5;
  doc.text(`Cliente: ${leadData.nome} | WhatsApp: ${leadData.whatsapp} | E-mail: ${leadData.email}`, 26, y);
  y += 18;

  // VAZAMENTO 1
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...gold);
  doc.text('VAZAMENTO 1 - Imposto Invisivel', 20, y);
  y += 6;

  drawCard(20, y, pageW - 40, 28);
  y += 7;
  doc.setFontSize(7);
  doc.setTextColor(...textLight);
  doc.text(`Seus ${formatarMoedaCompleto(resultados.imposto.valorBanco)} no bancao custam ${formatarMoedaCompleto(resultados.imposto.perdaAtual)}/ano em IR + taxas`, 26, y);
  y += 5;
  doc.text(`Otimizado: ${formatarMoedaCompleto(resultados.imposto.perdaOtimizada)}/ano`, 26, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...green);
  doc.text(`Economia: ${formatarMoedaCompleto(resultados.imposto.economiaAno)}/ano | ${formatarMoedaCompleto(resultados.imposto.economia5Anos)} em 5 anos`, 26, y);
  y += 14;

  // VAZAMENTO 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...gold);
  doc.text('VAZAMENTO 2 - Custo de Inventario', 20, y);
  y += 6;

  drawCard(20, y, pageW - 40, 28);
  y += 7;
  doc.setFontSize(7);
  doc.setTextColor(...textLight);
  doc.text(`Inventario PF: ${formatarMoedaCompleto(resultados.inventario.custoPF)} (${resultados.inventario.tempoPF})`, 26, y);
  y += 5;
  doc.text(`Holding: ${formatarMoedaCompleto(resultados.inventario.custoHolding)} (${resultados.inventario.tempoHolding})`, 26, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...green);
  doc.text(`Economia: ${formatarMoedaCompleto(resultados.inventario.economia)}`, 26, y);
  y += 14;

  // VAZAMENTO 3
  if (resultados.juros.temFinanciamento) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...gold);
    doc.text('VAZAMENTO 3 - Juros de Financiamento', 20, y);
    y += 6;

    drawCard(20, y, pageW - 40, 28);
    y += 7;
    doc.setFontSize(7);
    doc.setTextColor(...textLight);
    doc.text(`Financiamento: ${formatarMoedaCompleto(resultados.juros.custoFinanciamento)} de juros`, 26, y);
    y += 5;
    doc.text(`Consorcio estrategico: ${formatarMoedaCompleto(resultados.juros.custoConsorcio)} de taxa`, 26, y);
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...green);
    doc.text(`Economia: ${formatarMoedaCompleto(resultados.juros.economia)}`, 26, y);
    y += 16;
  }

  // TOTAL
  drawLine(y, green);
  y += 8;

  doc.setFillColor(...green);
  doc.roundedRect(20, y, pageW - 40, 24, 2, 2, 'F');
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(11, 17, 32);
  doc.text('POTENCIAL TOTAL DE ECONOMIA EM 5 ANOS', pageW / 2, y, { align: 'center' });
  y += 8;
  doc.setFontSize(14);
  doc.text(formatarMoedaCompleto(resultados.total.economia5Anos), pageW / 2, y, { align: 'center' });
  y += 18;

  // MAPA DE ENGENHARIA
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...green);
  doc.text('MAPA DE ENGENHARIA PATRIMONIAL', 20, y);
  y += 8;

  const colW = (pageW - 50) / 3;
  const cols = [
    { x: 20, titulo: 'PROTECAO', items: [
      'Migrar imoveis PF para Holding para zerar ITCMD',
      'Previdencia PGBL/VGBL com taxa 0,5% e sucessao direta',
      'Seguro vida resgatavel para liquidez do inventario',
    ]},
    { x: 20 + colW + 5, titulo: 'EFICIENCIA', items: [
      `Migrar ${formatarMoedaCompleto(resultados.imposto.valorBanco)} de CDB para FII + LCI isento`,
      `Ganho liquido: ${formatarMoedaCompleto(resultados.imposto.economiaAno)}/ano`,
      'Utilizar FGTS como lance em consorcio',
    ]},
    { x: 20 + (colW + 5) * 2, titulo: 'ALAVANCAGEM', items: [
      '2 cartas contempladas de R$ 400k',
      'Aluguel das cartas paga 80% das parcelas',
      'Patrimonio projetado: R$ 800k com R$ 150k entrada',
    ]},
  ];

  cols.forEach(col => {
    drawCard(col.x, y, colW, 50);
    doc.setFillColor(...green);
    doc.rect(col.x, y, colW, 0.8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...green);
    doc.text(col.titulo, col.x + colW / 2, y + 7, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...textLight);
    col.items.forEach((item, i) => {
      const lines = doc.splitTextToSize(`- ${item}`, colW - 8);
      doc.text(lines, col.x + 4, y + 14 + i * 12);
    });
  });

  y += 60;

  // Disclaimer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(5);
  doc.setTextColor(80, 80, 80);
  doc.text('Simulacao educativa com base em medias de mercado. Nao constitui recomendacao juridica ou tributaria. Valide com advogado e contador.', pageW / 2, pageH - 16, { align: 'center' });
  doc.text('Fincare Servicos Financeiros Ltda. | Dados protegidos conforme LGPD (Lei 13.709/2018)', pageW / 2, pageH - 12, { align: 'center' });

  const fileName = `Fincare_RaioXPatrimonial_${leadData.nome?.replace(/\s+/g, '_') || 'relatorio'}_${dataGeracao.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}
