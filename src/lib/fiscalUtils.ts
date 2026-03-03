// Barème IRPP 2025 (revenus 2024) - pour 1 part fiscale
const TRANCHES_IRPP = [
  { plafond: 11600, taux: 0 },
  { plafond: 29579, taux: 11 },
  { plafond: 84577, taux: 30 },
  { plafond: 181917, taux: 41 },
  { plafond: Infinity, taux: 45 },
];

/**
 * Calcule la TMI (Tranche Marginale d'Imposition) à partir du revenu imposable et du nombre de parts fiscales.
 * Le barème s'applique au quotient familial (revenu / parts), la TMI est le taux de la tranche dans laquelle tombe le quotient.
 */
export function calculateTMI(revenuImposable: number, parts: number): number {
  if (parts <= 0) parts = 1;
  const quotient = revenuImposable / parts;

  for (const tranche of TRANCHES_IRPP) {
    if (quotient <= tranche.plafond) {
      return tranche.taux;
    }
  }
  return 45;
}
