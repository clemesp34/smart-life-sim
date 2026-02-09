import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface SimulatorSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
  infoText?: string;
}

const SimulatorSelect = ({
  label,
  value,
  onChange,
  options,
  infoText,
}: SimulatorSelectProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm text-muted-foreground flex items-center gap-1">
        {label}
        {infoText && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-muted-foreground cursor-help">
                  <Info className="w-3 h-3" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                {infoText}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-28 h-8 text-right">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SimulatorSelect;