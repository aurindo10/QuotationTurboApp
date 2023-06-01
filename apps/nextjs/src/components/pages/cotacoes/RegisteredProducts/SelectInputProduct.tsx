import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "../../../../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "../../../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../components/ui/popover";
import { InputToAddProductOnCotation } from "./AddProductInput";
import { useProductsOfCotationStore } from "../../../../../zustandStore/ProductsOfCotationStore";
import { cn } from "../../../../../libs/utils";
import { AddProductModalFromCotation } from "./AddProductModalFromSelectProduct";

export function SelectInputProduct() {
  const [
    searchInputState,
    isLoading,
    value,
    setValue,
    setSelectedProduct,
    open,
    setOpen,
  ] = useProductsOfCotationStore((state) => [
    state.searchInputState,
    state.isLoading,
    state.selectedProductId,
    state.setSelectedProductId,
    state.setSelectedProduct,
    state.open,
    state.setOpen,
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
      <PopoverContent className="w-[300px] bg-slate-900">
        <Command className="w-full">
          <InputToAddProductOnCotation />
          <CommandEmpty className="w-full">
            <div className="w-full py-2">
              {isLoading ? (
                <button className={`btn btn-square btn-xs ${isLoading}`} />
              ) : (
                <AddProductModalFromCotation></AddProductModalFromCotation>
              )}
            </div>
          </CommandEmpty>
          <CommandGroup className="">
            {searchInputState.map((product) => (
              <div key={product.id}>
                <CommandItem
                  key={product.id}
                  className="my-2 rounded-lg bg-slate-800"
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
              </div>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
