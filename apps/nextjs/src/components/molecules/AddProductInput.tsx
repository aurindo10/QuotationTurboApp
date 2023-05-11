import { useUser } from "@clerk/nextjs";
import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { useProductsOfCotationStore } from "../../../zustandStore/ProductsOfCotationStore";
import { RouterOutputs, trpc } from "../../utils/trpc";
import _ from "lodash";
import { CommandInput } from "../../../components/ui/command";

type getProductByNameType = RouterOutputs["product"]["getProductByName"];
export const InputToAddProductOnCotation = () => {
  const [inputValue, setInputValue] = useState("");
  const { user } = useUser();
  const { mutateAsync: getProductByName } =
    trpc.product.getProductByName.useMutation();
  const [addProductToSearchState] = useProductsOfCotationStore((state) => [
    state.addProductToSearchState,
  ]);

  const handleSearch = async (value: string) => {
    const productsFound = await getProductByName({
      nome: value,
      idEmpresa: user?.publicMetadata.idEmpresa as string,
    });
    if (productsFound) {
      addProductToSearchState(productsFound);
      console.log(productsFound);
    }
  };
  const debouncedHandleSearch = useCallback(_.debounce(handleSearch, 600), []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    console.log(value);
    setInputValue(value);
    if (value.length > 3) {
      debouncedHandleSearch(value);
      addProductToSearchState([]);
    }
  };
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <input
      type="text"
      className="bg-slate-900 px-2 py-2"
      placeholder="Digite aqui"
      value={inputValue}
      onChange={handleChange}
    />
  );
};
