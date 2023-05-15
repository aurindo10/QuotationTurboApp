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
import { InputToAddProductOnCotation } from "../atoms/AddProductInput";
import { useProductsOfCotationStore } from "../../../zustandStore/ProductsOfCotationStore";
import { cn } from "../../../libs/utils";

export function SelectInputProduct() {
  const [open, setOpen] = React.useState(false);
  const [searchInputState, isLoading, value, setValue, setSelectedProduct] =
    useProductsOfCotationStore((state) => [
      state.searchInputState,
      state.isLoading,
      state.selectedProductId,
      state.setSelectedProductId,
      state.setSelectedProduct,
    ]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <label className="label w-[300px]">
        <span className="label-text">Escolha um Produto</span>
      </label>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value
            ? searchInputState.find((product) => product.id == value)?.nome
            : searchInputState.find((product) => product.id == value)?.nome ??
              "Selecione"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-neutral w-[300px]">
        <Command className="w-full">
          <InputToAddProductOnCotation />
          <CommandEmpty className="w-full">
            <div className="w-full py-2">
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
            {searchInputState.map((product) => (
              <div key={product.id}>
                <CommandItem
                  key={product.id}
                  value={product.id}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    setSelectedProduct();
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === product.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {`${product.nome}/ ${product.code}`}
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
