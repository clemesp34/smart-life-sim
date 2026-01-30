import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { parse, format, isValid } from "date-fns";
import { fr } from "date-fns/locale";

interface SimulatorDateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const SimulatorDateInput = ({ label, value, onChange }: SimulatorDateInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isValidDate, setIsValidDate] = useState(true);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const parseDate = (dateStr: string): Date | null => {
    const parsed = parse(dateStr, "dd/MM/yyyy", new Date());
    return isValid(parsed) ? parsed : null;
  };

  const validateAndUpdate = (newValue: string) => {
    setInputValue(newValue);
    
    // Validate format: dd/MM/yyyy
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = newValue.match(dateRegex);
    
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);
      
      // Check if date is valid
      const date = new Date(year, month - 1, day);
      const isValidDate = 
        date.getDate() === day && 
        date.getMonth() === month - 1 && 
        date.getFullYear() === year &&
        year >= 1900 && year <= 2100;
      
      setIsValidDate(isValidDate);
      if (isValidDate) {
        onChange(newValue);
      }
    } else if (newValue === "") {
      setIsValidDate(true);
    } else {
      setIsValidDate(false);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = format(date, "dd/MM/yyyy");
      setInputValue(formatted);
      setIsValidDate(true);
      onChange(formatted);
      setIsOpen(false);
    }
  };

  const selectedDate = parseDate(inputValue);

  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => validateAndUpdate(e.target.value)}
          className={cn(
            "simulator-input w-28 text-center h-8 px-2",
            !isValidDate && "border-destructive focus-visible:ring-destructive"
          )}
          placeholder="JJ/MM/AAAA"
        />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button type="button" className="focus:outline-none">
              <CalendarIcon className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={handleCalendarSelect}
              initialFocus
              locale={fr}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      {!isValidDate && (
        <span className="text-xs text-destructive absolute right-0 -bottom-4">
          Format invalide
        </span>
      )}
    </div>
  );
};

export default SimulatorDateInput;
