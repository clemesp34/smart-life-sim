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
import { Input } from "@/components/ui/input";

interface EpargneConstitueeModalProps {
  versementsAvant: string;
  versementsApres: string;
  interetsAvant: string;
  interetsApres: string;
  onVersementsAvantChange: (value: string) => void;
  onVersementsApresChange: (value: string) => void;
  onInteretsAvantChange: (value: string) => void;
  onInteretsApresChange: (value: string) => void;
  totalEpargne: string;
  showAvantSept17?: boolean; // true = afficher la colonne "Av. sept 17" (contrat avant 27/09/2017)
}

const EpargneConstitueeModal = ({
  versementsAvant,
  versementsApres,
  interetsAvant,
  interetsApres,
  onVersementsAvantChange,
  onVersementsApresChange,
  onInteretsAvantChange,
  onInteretsApresChange,
  totalEpargne,
  showAvantSept17 = true,
}: EpargneConstitueeModalProps) => {
  const [open, setOpen] = useState(false);

  const handleValidate = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between h-10 px-0 text-sm font-normal hover:bg-muted/50"
        >
          <span className="text-muted-foreground">Épargne constituée</span>
          <div className="flex items-center gap-2">
            <span className="text-foreground">{totalEpargne} €</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Épargne constituée</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-muted-foreground p-2"></th>
                {showAvantSept17 && (
                  <th className="text-center text-sm font-medium text-muted-foreground p-2">
                    Av. sept 17
                  </th>
                )}
                <th className="text-center text-sm font-medium text-muted-foreground p-2">
                  Ap. sept 17
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-sm text-muted-foreground p-2">Versements</td>
                {showAvantSept17 && (
                  <td className="p-1">
                    <div className="relative">
                      <Input
                        value={versementsAvant}
                        onChange={(e) => onVersementsAvantChange(e.target.value)}
                        className="text-right pr-6 h-9"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        €
                      </span>
                    </div>
                  </td>
                )}
                <td className="p-1">
                  <div className="relative">
                    <Input
                      value={versementsApres}
                      onChange={(e) => onVersementsApresChange(e.target.value)}
                      className="text-right pr-6 h-9"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      €
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-sm text-muted-foreground p-2">Intérêts</td>
                {showAvantSept17 && (
                  <td className="p-1">
                    <div className="relative">
                      <Input
                        value={interetsAvant}
                        onChange={(e) => onInteretsAvantChange(e.target.value)}
                        className="text-right pr-6 h-9"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        €
                      </span>
                    </div>
                  </td>
                )}
                <td className="p-1">
                  <div className="relative">
                    <Input
                      value={interetsApres}
                      onChange={(e) => onInteretsApresChange(e.target.value)}
                      className="text-right pr-6 h-9"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      €
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div className="flex justify-end mt-4">
            <Button onClick={handleValidate} className="bg-primary text-primary-foreground">
              Valider
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EpargneConstitueeModal;
