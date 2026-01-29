import { Input } from "@/components/ui/input";

interface SimulatorInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  unit?: string;
  info?: boolean;
  required?: boolean;
  type?: "text" | "number";
}

const SimulatorInput = ({ 
  label, 
  value, 
  onChange, 
  unit, 
  info = false,
  required = false,
  type = "text"
}: SimulatorInputProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm text-muted-foreground flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
        {info && (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-xs text-muted-foreground cursor-help">
            ?
          </span>
        )}
      </label>
      <div className="flex items-center gap-1">
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="simulator-input w-28 text-right h-8 px-2"
        />
        {unit && <span className="text-sm text-muted-foreground min-w-8">{unit}</span>}
      </div>
    </div>
  );
};

export default SimulatorInput;
