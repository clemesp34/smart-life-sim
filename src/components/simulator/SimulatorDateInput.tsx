import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SimulatorDateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const SimulatorDateInput = ({ label, value, onChange }: SimulatorDateInputProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="simulator-input w-28 text-center h-8 px-2"
          placeholder="JJ/MM/AAAA"
        />
        <Calendar className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
      </div>
    </div>
  );
};

export default SimulatorDateInput;
