import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface SimulatorInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  unit?: string;
  info?: boolean;
  infoText?: string;
  required?: boolean;
  type?: "text" | "number";
  disabled?: boolean;
  formatThousands?: boolean;
}

const SimulatorInput = ({ 
  label, 
  value, 
  onChange, 
  unit, 
  info = false,
  infoText,
  required = false,
  type = "text",
  disabled = false,
  formatThousands = true
}: SimulatorInputProps) => {
  const formatWithThousands = (val: string | number): string => {
    if (!formatThousands) return String(val);
    const numStr = String(val).replace(/\s/g, "").replace(",", ".");
    const num = parseFloat(numStr);
    if (isNaN(num)) return String(val);
    return num.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s/g, "");
    onChange(rawValue);
  };

  const handleBlur = () => {
    if (formatThousands) {
      const formatted = formatWithThousands(value);
      if (formatted !== String(value)) {
        onChange(formatted);
      }
    }
  };

  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm text-muted-foreground flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
        {(info || infoText) && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-muted-foreground cursor-help">
                  <Info className="w-3 h-3" />
                </span>
              </TooltipTrigger>
              {infoText && (
                <TooltipContent side="top" className="max-w-xs text-xs">
                  {infoText}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
      </label>
      <div className="flex items-center gap-1">
        <Input
          type={type}
          value={formatThousands ? formatWithThousands(value) : value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={`simulator-input w-28 text-right h-8 px-2 ${disabled ? 'opacity-50 cursor-not-allowed bg-muted' : ''}`}
        />
        {unit && <span className="text-sm text-muted-foreground min-w-8">{unit}</span>}
      </div>
    </div>
  );
};

export default SimulatorInput;