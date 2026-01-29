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
import SimulatorInput from "./SimulatorInput";

interface EpargneConstitueeModalProps {
  versements: string;
  interets: string;
  onVersementsChange: (value: string) => void;
  onInteretsChange: (value: string) => void;
}

const EpargneConstitueeModal = ({
  versements,
  interets,
  onVersementsChange,
  onInteretsChange,
}: EpargneConstitueeModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between h-10 px-3 text-sm font-normal hover:bg-muted/50"
        >
          <span className="text-muted-foreground">Épargne constituée</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Épargne constituée</DialogTitle>
        </DialogHeader>
        <div className="space-y-1 py-4">
          <SimulatorInput
            label="Versements"
            value={versements}
            onChange={onVersementsChange}
            unit="€"
          />
          <SimulatorInput
            label="Intérêts"
            value={interets}
            onChange={onInteretsChange}
            unit="€"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EpargneConstitueeModal;
