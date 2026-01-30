import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import FraisTable from "./FraisTable";

interface FraisContratModalProps {
  fraisGestionFondsEuros: string;
  fraisGestionUc: string;
  fraisSouscriptionFondsEuros: string;
  fraisSouscriptionUc: string;
  onFraisGestionFondsEurosChange: (value: string) => void;
  onFraisGestionUcChange: (value: string) => void;
  onFraisSouscriptionFondsEurosChange: (value: string) => void;
  onFraisSouscriptionUcChange: (value: string) => void;
}

const FraisContratModal = ({
  fraisGestionFondsEuros,
  fraisGestionUc,
  fraisSouscriptionFondsEuros,
  fraisSouscriptionUc,
  onFraisGestionFondsEurosChange,
  onFraisGestionUcChange,
  onFraisSouscriptionFondsEurosChange,
  onFraisSouscriptionUcChange,
}: FraisContratModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between h-10 px-3 text-sm font-normal hover:bg-muted/50"
        >
          <span className="text-muted-foreground">Frais du contrat</span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-4 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Frais de gestion</h4>
          <FraisTable
            fondsEuros={fraisGestionFondsEuros}
            uc={fraisGestionUc}
            onFondsEurosChange={onFraisGestionFondsEurosChange}
            onUcChange={onFraisGestionUcChange}
          />
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Frais de souscription</h4>
          <FraisTable
            fondsEuros={fraisSouscriptionFondsEuros}
            uc={fraisSouscriptionUc}
            onFondsEurosChange={onFraisSouscriptionFondsEurosChange}
            onUcChange={onFraisSouscriptionUcChange}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FraisContratModal;
