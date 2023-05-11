import { useUser } from "@clerk/nextjs";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useProductsOfCotationStore } from "../../../zustandStore/ProductsOfCotationStore";
import { RouterOutputs, trpc } from "../../utils/trpc";
import _ from "lodash";
import { InputDropdown } from "./InputDropDown";

type getProductByNameType = RouterOutputs["product"]["getProductByName"];
export const InputToAddProductOnCotation = () => {
  const [inputValue, setInputValue] = useState("");
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [products, setProducts] = useState<getProductByNameType>([]);
  const { mutateAsync: getProductByName } =
    trpc.product.getProductByName.useMutation();
  const [addManyProducts, allProductsState] = useProductsOfCotationStore(
    (state) => [state.addManyProducts, state.allProducts],
  );

  const handleSearch = async (value: string) => {
    const productsFound = await getProductByName({
      nome: value,
      idEmpresa: user?.publicMetadata.idEmpresa as string,
    });
    if (productsFound) {
      setIsDropdownOpen(true);
      setProducts(productsFound);
      console.log(productsFound);
    }
  };
  const debouncedHandleSearch = useCallback(_.debounce(handleSearch, 600), []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    if (value.length > 3) {
      debouncedHandleSearch(value);
      setProducts([]);
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="flex">
      <input
        type="text"
        placeholder="Type here"
        value={inputValue}
        onChange={handleChange}
        className="input input-bordered w-full max-w-xs"
      />
      <InputDropdown
        isOpen={isDropdownOpen}
        setIsOpen={setIsDropdownOpen}
        products={products}
      ></InputDropdown>
    </div>
  );
};
