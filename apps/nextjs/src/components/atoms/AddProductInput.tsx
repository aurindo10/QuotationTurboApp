import { useUser } from "@clerk/nextjs";
import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { useProductsOfCotationStore } from "../../../zustandStore/ProductsOfCotationStore";
import { RouterOutputs, trpc } from "../../utils/trpc";
import _ from "lodash";
import { CommandInput } from "../../../components/ui/command";

type getProductByNameType = RouterOutputs["product"]["getProductByName"];
interface InputToAddProductOnCotationProps {
  setValue: React.Dispatch<React.SetStateAction<string>>;
}
export const InputToAddProductOnCotation = () => {
  const { mutateAsync: getProductByName } =
    trpc.product.getProductByName.useMutation();
  const [
    addProductToSearchState,
    setIsLoading,
    setValue,
    inputValue,
    setInputValue,
  ] = useProductsOfCotationStore((state) => [
    state.addProductToSearchState,
    state.setIsLoading,
    state.setSelectedProductId,
    state.productName,
    state.setProductName,
  ]);

  const handleSearch = async (value: string) => {
    setIsLoading("loading");
    if (value.length > 3) {
      const productsFound = await getProductByName({
        nome: value,
      });
      addProductToSearchState(productsFound);
    } else {
      addProductToSearchState([]);
      setValue("");
    }
    setIsLoading("");
  };
  const debouncedHandleSearch = useCallback(_.debounce(handleSearch, 300), []);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length < 3) {
      addProductToSearchState([]);
    }
    setIsLoading("loading");
    setInputValue(value);
    debouncedHandleSearch(value);
  };
  return (
    <div className="px-1 py-1">
      <input
        type="text"
        className="input input-bordered input-warning w-full bg-slate-900 px-2 py-2"
        placeholder="Digite aqui"
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
};
