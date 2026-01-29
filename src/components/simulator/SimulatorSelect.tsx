import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SimulatorSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const SimulatorSelect = ({ label, value, onChange, options }: SimulatorSelectProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-28 h-8 border-0 border-b border-input rounded-none bg-transparent focus:ring-0">
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
