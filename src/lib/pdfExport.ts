import jsPDF from "jspdf";

interface SimulationData {
  // Données du contrat
  dateOuverture: string;
  versementsAvant: number;
  versementsApres: number;
  interetsAvant: number;
  interetsApres: number;
  totalEpargne: number;

  // Situation fiscale
  revenuImposable: number;
  nombreParts: number;
  tmi: number;
  abattementDisponible: number;
  isContractOver8Years: boolean;

  // Rachat
  montantRachete: number;
  partCapitalRachat: number;
  partInteretsRachat: number;

  // Détail intérêts
  interetsTaxables: number;
  abattementTotal: number;

  // PFU
  impositionPFU: number;
  prelevementsSociauxPFU: number;
  cehrPFU: number;
  totalPFU: number;
  montantNetPFU: number;

  // Barème
  impositionBareme: number;
  prelevementsSociauxBareme: number;
  cehrBareme: number;
  gainCsgDeductible: number;
  totalBareme: number;
  montantNetBareme: number;

  // Résultat
  pfuIsBetter: boolean;
  economie: number;
  cehrRate: number;
}

const fmt = (n: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function drawPieChart(
  doc: jsPDF,
  cx: number,
  cy: number,
  radius: number,
  capitalPct: number,
  interetsPct: number
) {
  const startAngle = -Math.PI / 2;

  // Capital slice (green)
  const capitalEnd = startAngle + capitalPct * 2 * Math.PI;
  doc.setFillColor(34, 139, 34);
  drawSlice(doc, cx, cy, radius, startAngle, capitalEnd);

  // Intérêts slice (orange)
  const interetsEnd = capitalEnd + interetsPct * 2 * Math.PI;
  doc.setFillColor(255, 140, 0);
  drawSlice(doc, cx, cy, radius, capitalEnd, interetsEnd);

  // Legend
  const legendY = cy + radius + 12;
  doc.setFillColor(34, 139, 34);
  doc.rect(cx - 35, legendY - 3, 8, 8, "F");
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(`Capital (${(capitalPct * 100).toFixed(1)}%)`, cx - 24, legendY + 3);

  doc.setFillColor(255, 140, 0);
  doc.rect(cx + 15, legendY - 3, 8, 8, "F");
  doc.text(`Intérêts (${(interetsPct * 100).toFixed(1)}%)`, cx + 26, legendY + 3);
}

function drawSlice(
  doc: jsPDF,
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const steps = 60;
  const points: [number, number][] = [[cx, cy]];
  const delta = (endAngle - startAngle) / steps;
  for (let i = 0; i <= steps; i++) {
    const a = startAngle + i * delta;
    points.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  points.push([cx, cy]);

  // Draw filled polygon
  const lines: { op: string; c: [number, number] }[] = [];
  for (let i = 1; i < points.length; i++) {
    lines.push({ op: i === 1 ? "m" : "l", c: points[i] });
  }

  // Use low-level path
  doc.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    doc.lineTo(points[i][0], points[i][1]);
  }

  // @ts-ignore - internal method for fill
  doc.internal.out("f");
}

function addSection(
  doc: jsPDF,
  y: number,
  title: string,
  rows: [string, string][],
  pageWidth: number
): number {
  const marginLeft = 20;
  const marginRight = pageWidth - 20;

  // Section title with green underline
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 139, 34);
  doc.text(title, marginLeft, y);
  doc.setDrawColor(34, 139, 34);
  doc.setLineWidth(0.5);
  doc.line(marginLeft, y + 1.5, marginLeft + doc.getTextWidth(title), y + 1.5);
  y += 8;

  // Rows
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  for (const [label, value] of rows) {
    doc.setTextColor(100, 100, 100);
    doc.text(label, marginLeft + 4, y);
    doc.setTextColor(40, 40, 40);
    doc.text(value, marginRight, y, { align: "right" });
    y += 5.5;
  }

  return y;
}

function addComparisonBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  title: string,
  isOptimal: boolean,
  rows: [string, string][],
  totalLabel: string,
  totalValue: string,
  netLabel: string,
  netValue: string
): number {
  const boxHeight = 10 + rows.length * 5.5 + 20;

  // Box border
  if (isOptimal) {
    doc.setDrawColor(34, 139, 34);
    doc.setLineWidth(1);
  } else {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
  }
  doc.roundedRect(x, y, width, boxHeight, 3, 3, "S");

  let cy = y + 7;

  // Title
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text(title, x + 6, cy);

  if (isOptimal) {
    doc.setFillColor(34, 139, 34);
    doc.roundedRect(x + width - 30, cy - 4, 24, 6, 1, 1, "F");
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text("Optimal", x + width - 28, cy);
  }

  cy += 7;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  for (const [label, value] of rows) {
    doc.setTextColor(120, 120, 120);
    doc.text(label, x + 6, cy);
    doc.setTextColor(40, 40, 40);
    doc.text(value, x + width - 6, cy, { align: "right" });
    cy += 5.5;
  }

  // Separator
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(x + 6, cy, x + width - 6, cy);
  cy += 5;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text(totalLabel, x + 6, cy);
  doc.setTextColor(200, 50, 50);
  doc.text(totalValue, x + width - 6, cy, { align: "right" });
  cy += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(netLabel, x + 6, cy);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text(netValue, x + width - 6, cy, { align: "right" });

  return y + boxHeight;
}

export function generatePDF(data: SimulationData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginLeft = 20;
  const marginRight = pageWidth - 20;

  // Header bar
  doc.setFillColor(34, 139, 34);
  doc.rect(0, 0, pageWidth, 18, "F");
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Simulateur de rachat — Assurance Vie", pageWidth / 2, 11, { align: "center" });

  // Date
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  const today = new Date().toLocaleDateString("fr-FR");
  doc.text(`Généré le ${today}`, pageWidth - 20, 16, { align: "right" });

  let y = 28;

  // Données du contrat
  y = addSection(doc, y, "Données du contrat", [
    ["Date d'ouverture", data.dateOuverture],
    ["Versements av. sept 2017", `${fmt(data.versementsAvant)} €`],
    ["Versements ap. sept 2017", `${fmt(data.versementsApres)} €`],
    ["Intérêts av. sept 2017", `${fmt(data.interetsAvant)} €`],
    ["Intérêts ap. sept 2017", `${fmt(data.interetsApres)} €`],
    ["Épargne totale", `${fmt(data.totalEpargne)} €`],
  ], pageWidth);

  y += 4;

  // Situation fiscale
  y = addSection(doc, y, "Situation fiscale", [
    ["Revenu imposable", `${fmt(data.revenuImposable)} €`],
    ["Nombre de parts", `${data.nombreParts}`],
    ["TMI", `${data.tmi}%`],
    ["Abattement disponible", data.isContractOver8Years ? `${fmt(data.abattementDisponible)} €` : "N/A (contrat < 8 ans)"],
  ], pageWidth);

  y += 4;

  // Rachat + Camembert
  y = addSection(doc, y, "Détail du rachat", [
    ["Montant racheté", `${fmt(data.montantRachete)} €`],
    ["Part en capital", `${fmt(data.partCapitalRachat)} €`],
    ["Part en intérêts", `${fmt(data.partInteretsRachat)} €`],
    ["Intérêts taxables (après abattement)", `${fmt(data.interetsTaxables)} €`],
  ], pageWidth);

  // Pie chart
  if (data.montantRachete > 0) {
    const capitalPct = data.partCapitalRachat / data.montantRachete;
    const interetsPct = data.partInteretsRachat / data.montantRachete;
    const chartCx = pageWidth / 2;
    const chartCy = y + 22;
    drawPieChart(doc, chartCx, chartCy, 18, capitalPct, interetsPct);
    y = chartCy + 35;
  }

  y += 4;

  // Comparatif fiscal
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 139, 34);
  doc.text("Comparatif fiscal", marginLeft, y);
  doc.setDrawColor(34, 139, 34);
  doc.setLineWidth(0.5);
  doc.line(marginLeft, y + 1.5, marginLeft + doc.getTextWidth("Comparatif fiscal"), y + 1.5);
  y += 8;

  const boxWidth = (marginRight - marginLeft - 6) / 2;

  const pfuRows: [string, string][] = [
    [`IR (PFU)`, `${fmt(data.impositionPFU)} €`],
    [`PS (17,2%)`, `${fmt(data.prelevementsSociauxPFU)} €`],
    [`CEHR (${data.cehrRate}%)`, `${fmt(data.cehrPFU)} €`],
  ];

  const baremeRows: [string, string][] = [
    [`IR (${data.tmi}%)`, `${fmt(data.impositionBareme)} €`],
    [`PS (17,2%)`, `${fmt(data.prelevementsSociauxBareme)} €`],
    [`CEHR (${data.cehrRate}%)`, `${fmt(data.cehrBareme)} €`],
  ];
  if (data.gainCsgDeductible > 0) {
    baremeRows.push([`CSG déductible`, `- ${fmt(data.gainCsgDeductible)} €`]);
  }

  const pfuBottom = addComparisonBox(
    doc, marginLeft, y, boxWidth, "PFU", data.pfuIsBetter,
    pfuRows, "Total", `${fmt(data.totalPFU)} €`, "Montant net", `${fmt(data.montantNetPFU)} €`
  );

  const baremeBottom = addComparisonBox(
    doc, marginLeft + boxWidth + 6, y, boxWidth, "Barème", !data.pfuIsBetter,
    baremeRows, "Total", `${fmt(data.totalBareme)} €`, "Montant net", `${fmt(data.montantNetBareme)} €`
  );

  y = Math.max(pfuBottom, baremeBottom) + 8;

  // Check if we need a new page
  if (y > 270) {
    doc.addPage();
    y = 20;
  }

  // Économie
  doc.setFillColor(34, 139, 34, 20);
  doc.setDrawColor(34, 139, 34);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, y, marginRight - marginLeft, 16, 3, 3, "FD");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Économie avec ${data.pfuIsBetter ? "PFU" : "Barème"}`, marginLeft + 6, y + 6);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(34, 139, 34);
  doc.text(`${fmt(data.economie)} €`, marginRight - 6, y + 12, { align: "right" });

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(170, 170, 170);
  doc.text(
    "Document généré à titre informatif — ne constitue pas un conseil fiscal.",
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" }
  );

  doc.save(`simulation-rachat-${today.replace(/\//g, "-")}.pdf`);
}

export type { SimulationData };
