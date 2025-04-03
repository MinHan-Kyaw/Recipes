import { useState, useMemo } from "react";
import countryList from "react-select-country-list";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CountrySelector({
  value,
  onChange,
}: CountrySelectorProps): JSX.Element {
  const [open, setOpen] = useState(false);
  // Using useMemo to avoid recreating the country list on every render
  const countries = useMemo(() => countryList().getData(), []);

  return (
    <div className="space-y-2">
      <Label htmlFor="country">
        Country <span className="text-red-500">*</span>
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? countries.find((country) => country.value === value)?.label
              : "Select a country..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={country.label}
                  onSelect={() => {
                    onChange(country.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {country.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
