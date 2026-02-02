import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  montantRachete: string;
  totalEpargne: string;
}

const ResultsPanel = ({ isOpen, onClose, montantRachete, totalEpargne }: ResultsPanelProps) => {
  if (!isOpen) return null;

  const parseNumber = (value: string) => {
    return parseFloat(value.replace(/\s/g, "").replace(",", ".")) || 0;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const montant = parseNumber(montantRachete);
  const epargne = parseNumber(totalEpargne);
  
  // Calculs simplifiés pour démonstration
  const partCapital = epargne > 0 ? (montant * 0.7) : 0;
  const partInterets = epargne > 0 ? (montant * 0.3) : 0;
  const impositionBrute = partInterets * 0.128; // PFU 12.8%
  const prelevementsSociaux = partInterets * 0.172; // 17.2%
  const montantNet = montant - impositionBrute - prelevementsSociaux;

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Résultats</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="p-6 space-y-6">
        {/* KPIs principaux */}
        <div className="space-y-4">
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Montant net du rachat</p>
            <p className="text-2xl font-bold text-primary">{formatNumber(montantNet)} €</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Part en capital</p>
              <p className="text-lg font-semibold text-foreground">{formatNumber(partCapital)} €</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Part en intérêts</p>
              <p className="text-lg font-semibold text-foreground">{formatNumber(partInterets)} €</p>
            </div>
          </div>
        </div>

        {/* Détails fiscalité */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Détails fiscalité</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Imposition brute (PFU)</span>
              <span className="text-sm font-medium text-foreground">{formatNumber(impositionBrute)} €</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Prélèvements sociaux</span>
              <span className="text-sm font-medium text-foreground">{formatNumber(prelevementsSociaux)} €</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-foreground">Total des prélèvements</span>
              <span className="text-sm font-bold text-destructive">{formatNumber(impositionBrute + prelevementsSociaux)} €</span>
            </div>
          </div>
        </div>

        {/* Récapitulatif */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Montant racheté</span>
            <span className="text-sm font-medium">{formatNumber(montant)} €</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Épargne totale</span>
            <span className="text-sm font-medium">{formatNumber(epargne)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
