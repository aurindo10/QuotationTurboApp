"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "../../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { InputToAddProductOnCotation } from "../molecules/AddProductInput";
import { useProductsOfCotationStore } from "../../../zustandStore/ProductsOfCotationStore";
import { cn } from "../../../libs/utils";

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [searchInputState, isLoading] = useProductsOfCotationStore((state) => [
    state.searchInputState,
    state.isLoading,
  ]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? searchInputState.find((product) => product.id == value)?.nome
            : "Selecione"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <InputToAddProductOnCotation />
          <CommandEmpty>
            <div className="py-2">
              {isLoading ? (
                <button className={`btn btn-square btn-xs ${isLoading}`} />
              ) : (
                <label className="text-white">
                  Não foi encontrado nenhum produto
                </label>
              )}
            </div>
          </CommandEmpty>
          <CommandGroup>
            {searchInputState.map((framework) => (
              <div>
                <CommandItem
                  key={framework.id}
                  value={framework.id}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {framework.nome}
                </CommandItem>
                <div className="h-[0.1px] w-full bg-white"></div>
              </div>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
