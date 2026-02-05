import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  montantRachete: string;
  versementsAvant: string;
  versementsApres: string;
  interetsAvant: string;
  interetsApres: string;
  abattementDisponible: string;
  isContractOver8Years: boolean;
  tmi: string;
  revenuImposable: string;
  nombreParts: string;
}

const ResultsPanel = ({
  isOpen,
  onClose,
  montantRachete,
  versementsAvant,
  versementsApres,
  interetsAvant,
  interetsApres,
  abattementDisponible,
  isContractOver8Years,
  tmi,
  revenuImposable,
  nombreParts,
}: ResultsPanelProps) => {
  if (!isOpen) return null;

  const parseNumber = (value: string) => {
    return parseFloat(value.replace(/\s/g, "").replace(",", ".")) || 0;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const montant = parseNumber(montantRachete);
  const revenu = parseNumber(revenuImposable);
  const parts = parseNumber(nombreParts);
  
  // Total des versements et intérêts
  const totalVersements = parseNumber(versementsAvant) + parseNumber(versementsApres);
  const interetsAvantValue = parseNumber(interetsAvant);
  const interetsApresValue = parseNumber(interetsApres);
  const totalInterets = interetsAvantValue + interetsApresValue;
  
  // Épargne constituée = somme des versements + intérêts
  const totalEpargne = totalVersements + totalInterets;
  
  // Quotité de capital et d'intérêts
  const quotiteCapital = totalEpargne > 0 ? totalVersements / totalEpargne : 0;
  const quotiteInterets = totalEpargne > 0 ? totalInterets / totalEpargne : 0;
  
  // Parts dans le rachat
  const partCapitalRachat = montant * quotiteCapital;
  const partInteretsRachat = montant * quotiteInterets;
  
  // Répartition des intérêts du rachat entre av. et ap. sept 17 (prorata)
  const quotiteInteretsAvant = totalInterets > 0 ? interetsAvantValue / totalInterets : 0;
  const quotiteInteretsApres = totalInterets > 0 ? interetsApresValue / totalInterets : 0;
  const partInteretsAvantRachat = partInteretsRachat * quotiteInteretsAvant;
  const partInteretsApresRachat = partInteretsRachat * quotiteInteretsApres;
  
  // Abattement (seulement si contrat > 8 ans)
  const abattement = isContractOver8Years ? parseNumber(abattementDisponible) : 0;
  
  // Règle des 150 000 € pour intérêts ap. sept 17 au PFU
  // Calcul de la part des intérêts ap. sept 17 éligible au taux de 7,5%
  const versementsAvantValue = parseNumber(versementsAvant);
  const versementsApresValue = parseNumber(versementsApres);
  const seuilVersements = 150000;
  
  // Proportion des intérêts ap. sept 17 éligibles au taux 7,5%
  // = Max(0, 150 000 - versements av. sept 17) / versements ap. sept 17
  let proportionInteretsApres75 = 0;
  if (versementsApresValue > 0) {
    const partVersementsEligible75 = Math.max(0, seuilVersements - versementsAvantValue);
    proportionInteretsApres75 = Math.min(1, partVersementsEligible75 / versementsApresValue);
  }
  
  // Intérêts ap. sept 17 dans le rachat répartis selon le seuil
  const interetsApres75 = partInteretsApresRachat * proportionInteretsApres75; // éligibles 7,5%
  const interetsApres128 = partInteretsApresRachat * (1 - proportionInteretsApres75); // imposables 12,8%
  
  // Application de l'abattement en cascade:
  // 1. Intérêts av. sept 17
  // 2. Intérêts ap. sept 17 à 7,5%
  // 3. Intérêts ap. sept 17 à 12,8%
  const abattementSurAvant = Math.min(abattement, partInteretsAvantRachat);
  const abattementRestant1 = abattement - abattementSurAvant;
  const abattementSurApres75 = Math.min(abattementRestant1, interetsApres75);
  const abattementRestant2 = abattementRestant1 - abattementSurApres75;
  const abattementSurApres128 = Math.min(abattementRestant2, interetsApres128);
  const abattementTotal = abattementSurAvant + abattementSurApres75 + abattementSurApres128;
  
  // Intérêts taxables après abattement (pour chaque catégorie)
  const interetsTaxablesAvant = Math.max(0, partInteretsAvantRachat - abattementSurAvant);
  const interetsTaxablesApres75 = Math.max(0, interetsApres75 - abattementSurApres75);
  const interetsTaxablesApres128 = Math.max(0, interetsApres128 - abattementSurApres128);
  const interetsTaxables = interetsTaxablesAvant + interetsTaxablesApres75 + interetsTaxablesApres128;
  
  // TMI en pourcentage
  const tmiRate = parseNumber(tmi) / 100;
  
  // Calcul CEHR (Contribution Exceptionnelle sur les Hauts Revenus)
  const calculateCEHR = (interetsTaxablesValue: number) => {
    const revenuPlusInterets = revenu + interetsTaxablesValue;
    
    if (parts === 1) {
      if (revenuPlusInterets > 500000) {
        return interetsTaxablesValue * 0.04;
      } else if (revenuPlusInterets > 250000) {
        return interetsTaxablesValue * 0.03;
      }
    } else if (parts >= 2) {
      if (revenuPlusInterets > 1000000) {
        return interetsTaxablesValue * 0.04;
      } else if (revenuPlusInterets > 500000) {
        return interetsTaxablesValue * 0.03;
      }
    }
    return 0;
  };
  
  const getCEHRRate = (interetsTaxablesValue: number) => {
    const revenuPlusInterets = revenu + interetsTaxablesValue;
    
    if (parts === 1) {
      if (revenuPlusInterets > 500000) return 4;
      if (revenuPlusInterets > 250000) return 3;
    } else if (parts >= 2) {
      if (revenuPlusInterets > 1000000) return 4;
      if (revenuPlusInterets > 500000) return 3;
    }
    return 0;
  };
  
  // CEHR s'applique aux deux régimes
  const cehrPFU = calculateCEHR(interetsTaxables);
  const cehrBareme = calculateCEHR(interetsTaxables);
  const cehrRate = getCEHRRate(interetsTaxables);
  
  // Calcul PFU: intérêts av. sept 17 à 7,5% | intérêts ap. sept 17 à 12,8% | PS (17,2%) sur tous les intérêts
  const impositionPFUAvant = interetsTaxablesAvant * 0.075; // 7,5% pour av. sept 17
  const impositionPFUApres75 = interetsTaxablesApres75 * 0.075; // 7,5% pour ap. sept 17 ≤ 150k
  const impositionPFUApres128 = interetsTaxablesApres128 * 0.128; // 12,8% pour ap. sept 17 > 150k
  const impositionPFU = impositionPFUAvant + impositionPFUApres75 + impositionPFUApres128;
  const prelevementsSociauxPFU = partInteretsRachat * 0.172;
  const totalPFU = impositionPFU + prelevementsSociauxPFU + cehrPFU;
  const montantNetPFU = montant - totalPFU;
  
  // Calcul Barème: IR (TMI%) = (part intérêts - abattement) * TMI | PS (17,2%) = part intérêts * 17,2%
  const impositionBareme = interetsTaxables * tmiRate;
  const prelevementsSociauxBareme = partInteretsRachat * 0.172;
  
  // CSG déductible (uniquement pour le barème): 6,8% des intérêts taxables → gain = CSG déductible × TMI
  const csgDeductible = interetsTaxables * 0.068;
  const gainCsgDeductible = csgDeductible * tmiRate;
  
  const totalBareme = impositionBareme + prelevementsSociauxBareme + cehrBareme - gainCsgDeductible;
  const montantNetBareme = montant - totalBareme;
  
  // Déterminer le meilleur régime
  const pfuIsBetter = totalPFU <= totalBareme;

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Résultats</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Récapitulatif du rachat */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Récapitulatif du rachat</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Part en capital</p>
              <p className="text-lg font-semibold text-foreground">{formatNumber(partCapitalRachat)} €</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Part en intérêts</p>
              <p className="text-lg font-semibold text-foreground">{formatNumber(partInteretsRachat)} €</p>
            </div>
          </div>
          
          {/* Détail intérêts av/ap sept 17 avec abattement */}
          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Répartition des intérêts du rachat</p>
            
            {/* Intérêts avant sept 17 */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Intérêts av. sept 17</span>
              <span className="text-xs font-medium text-foreground">{formatNumber(partInteretsAvantRachat)} €</span>
            </div>
            {isContractOver8Years && abattementSurAvant > 0 && (
              <div className="flex justify-between items-center pl-3">
                <span className="text-xs text-muted-foreground">Abattement appliqué</span>
                <span className="text-xs font-medium text-foreground">- {formatNumber(abattementSurAvant)} €</span>
              </div>
            )}
            
            {/* Intérêts après sept 17 - part à 7,5% */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Intérêts ap. sept 17 (7,5%)</span>
              <span className="text-xs font-medium text-foreground">{formatNumber(interetsApres75)} €</span>
            </div>
            {isContractOver8Years && abattementSurApres75 > 0 && (
              <div className="flex justify-between items-center pl-3">
                <span className="text-xs text-muted-foreground">Abattement appliqué</span>
                <span className="text-xs font-medium text-foreground">- {formatNumber(abattementSurApres75)} €</span>
              </div>
            )}
            
            {/* Intérêts après sept 17 - part à 12,8% */}
            {interetsApres128 > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Intérêts ap. sept 17 (12,8%)</span>
                <span className="text-xs font-medium text-foreground">{formatNumber(interetsApres128)} €</span>
              </div>
            )}
            {isContractOver8Years && abattementSurApres128 > 0 && (
              <div className="flex justify-between items-center pl-3">
                <span className="text-xs text-muted-foreground">Abattement appliqué</span>
                <span className="text-xs font-medium text-foreground">- {formatNumber(abattementSurApres128)} €</span>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-xs font-medium text-foreground">Intérêts taxables</span>
              <span className="text-xs font-medium text-foreground">{formatNumber(interetsTaxables)} €</span>
            </div>
          </div>
        </div>

        {/* Comparatif fiscal */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Comparatif fiscal</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {/* PFU */}
            <div className={`rounded-lg p-4 border-2 ${pfuIsBetter ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">PFU</span>
                {pfuIsBetter && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Optimal</span>
                )}
              </div>
              <div className="space-y-2 text-xs">
                {interetsTaxablesAvant > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IR av. sept 17 (7,5%)</span>
                    <span className="text-foreground">{formatNumber(impositionPFUAvant)} €</span>
                  </div>
                )}
                {interetsTaxablesApres75 > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IR ap. sept 17 (7,5%)</span>
                    <span className="text-foreground">{formatNumber(impositionPFUApres75)} €</span>
                  </div>
                )}
                {interetsTaxablesApres128 > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IR ap. sept 17 (12,8%)</span>
                    <span className="text-foreground">{formatNumber(impositionPFUApres128)} €</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PS (17,2%)</span>
                  <span className="text-foreground">{formatNumber(prelevementsSociauxPFU)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CEHR ({cehrRate}%)</span>
                  <span className="text-foreground">{formatNumber(cehrPFU)} €</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-medium text-destructive">{formatNumber(totalPFU)} €</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">Montant net</p>
                <p className="text-lg font-bold text-foreground">{formatNumber(montantNetPFU)} €</p>
              </div>
            </div>
            
            {/* Barème progressif */}
            <div className={`rounded-lg p-4 border-2 ${!pfuIsBetter ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Barème</span>
                {!pfuIsBetter && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Optimal</span>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IR ({tmi}%)</span>
                  <span className="text-foreground">{formatNumber(impositionBareme)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PS (17,2%)</span>
                  <span className="text-foreground">{formatNumber(prelevementsSociauxBareme)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CEHR ({cehrRate}%)</span>
                  <span className="text-foreground">{formatNumber(cehrBareme)} €</span>
                </div>
                {gainCsgDeductible > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CSG déductible (6,8%)</span>
                    <span className="text-green-600">- {formatNumber(gainCsgDeductible)} €</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-medium text-destructive">{formatNumber(totalBareme)} €</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">Montant net</p>
                <p className="text-lg font-bold text-foreground">{formatNumber(montantNetBareme)} €</p>
              </div>
            </div>
          </div>
        </div>

        {/* Économie potentielle */}
        <div className="bg-primary/10 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Économie avec {pfuIsBetter ? 'PFU' : 'Barème'}
          </p>
          <p className="text-2xl font-bold text-primary">
            {formatNumber(Math.abs(totalPFU - totalBareme))} €
          </p>
        </div>

        {/* Données de base */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Montant racheté</span>
            <span className="text-sm font-medium">{formatNumber(montant)} €</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Épargne totale</span>
            <span className="text-sm font-medium">{formatNumber(totalEpargne)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
