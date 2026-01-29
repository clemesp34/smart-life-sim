import { Input } from "@/components/ui/input";

interface FraisTableProps {
  fondsEuros: string;
  uc: string;
  onFondsEurosChange: (value: string) => void;
  onUcChange: (value: string) => void;
}

const FraisTable = ({
  fondsEuros,
  uc,
  onFondsEurosChange,
  onUcChange,
}: FraisTableProps) => {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-2">
        <div className="simulator-table-header">Pour les fonds en euros</div>
        <div className="simulator-table-header">Pour les UC</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="flex items-center justify-center py-2 border-r border-border">
          <Input
            type="text"
            value={fondsEuros}
            onChange={(e) => onFondsEurosChange(e.target.value)}
            className="simulator-input w-12 text-center h-8 px-1"
          />
          <span className="text-sm text-muted-foreground ml-1">%</span>
        </div>
        <div className="flex items-center justify-center py-2">
          <Input
            type="text"
            value={uc}
            onChange={(e) => onUcChange(e.target.value)}
            className="simulator-input w-12 text-center h-8 px-1"
          />
          <span className="text-sm text-muted-foreground ml-1">%</span>
        </div>
      </div>
    </div>
  );
};

export default FraisTable;
