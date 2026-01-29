import { Input } from "@/components/ui/input";

interface AllocationTableProps {
  fondsEuros: string;
  ucHorsImmobilier: string;
  ucImmobilier: string;
  onFondsEurosChange: (value: string) => void;
  onUcHorsImmobilierChange: (value: string) => void;
  onUcImmobilierChange: (value: string) => void;
}

const AllocationTable = ({
  fondsEuros,
  ucHorsImmobilier,
  ucImmobilier,
  onFondsEurosChange,
  onUcHorsImmobilierChange,
  onUcImmobilierChange,
}: AllocationTableProps) => {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-3">
        <div className="simulator-table-header">Fonds en euros</div>
        <div className="simulator-table-header">UC hors immobilier IFI</div>
        <div className="simulator-table-header">UC immobilier IFI</div>
      </div>
      <div className="grid grid-cols-3">
        <div className="flex items-center justify-center py-2 border-r border-border">
          <Input
            type="text"
            value={fondsEuros}
            onChange={(e) => onFondsEurosChange(e.target.value)}
            className="simulator-input w-12 text-center h-8 px-1"
          />
          <span className="text-sm text-muted-foreground ml-1">%</span>
        </div>
        <div className="flex items-center justify-center py-2 border-r border-border">
          <Input
            type="text"
            value={ucHorsImmobilier}
            onChange={(e) => onUcHorsImmobilierChange(e.target.value)}
            className="simulator-input w-12 text-center h-8 px-1"
          />
          <span className="text-sm text-muted-foreground ml-1">%</span>
        </div>
        <div className="flex items-center justify-center py-2">
          <Input
            type="text"
            value={ucImmobilier}
            onChange={(e) => onUcImmobilierChange(e.target.value)}
            className="simulator-input w-12 text-center h-8 px-1"
          />
          <span className="text-sm text-muted-foreground ml-1">%</span>
        </div>
      </div>
    </div>
  );
};

export default AllocationTable;
