import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface SimulatorSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}
const SimulatorSelect = ({
  label,
  value,
  onChange,
  options
}: SimulatorSelectProps) => {
  return;
};
export default SimulatorSelect;