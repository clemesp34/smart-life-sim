import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  const handleValidate = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between h-10 px-3 text-sm font-normal hover:bg-muted/50"
        >
          <span className="text-muted-foreground">Frais du contrat</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Frais du contrat</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
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
          
          <div className="flex justify-end">
            <Button onClick={handleValidate} className="bg-primary text-primary-foreground">
              Valider
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FraisContratModal;
