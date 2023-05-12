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
  const [inputValue, setInputValue] = useState("");
  const { user } = useUser();
  const { mutateAsync: getProductByName } =
    trpc.product.getProductByName.useMutation();
  const [addProductToSearchState, setIsLoading, setValue] =
    useProductsOfCotationStore((state) => [
      state.addProductToSearchState,
      state.setIsLoading,
      state.setSelectedProductId,
    ]);

  const handleSearch = async (value: string) => {
    setIsLoading("loading");
    if (value.length > 3) {
      const productsFound = await getProductByName({
        nome: value,
        idEmpresa: user?.publicMetadata.idEmpresa as string,
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
    <input
      type="text"
      className="bg-neutral w-full px-2 py-2"
      placeholder="Digite aqui"
      value={inputValue}
      onChange={handleChange}
    />
  );
};
