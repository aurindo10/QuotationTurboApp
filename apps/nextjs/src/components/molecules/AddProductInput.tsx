import { useUser } from "@clerk/nextjs";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useProductsOfCotationStore } from "../../../zustandStore/ProductsOfCotationStore";
import { trpc } from "../../utils/trpc";
import _ from "lodash";

export const InputToAddProductOnCotation = () => {
  const [inputValue, setInputValue] = useState("");
  const { user } = useUser();
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
    const productsFoundOneLevelUp = productsFound.map((product) => {
      return {
        produto: product,
      };
    });
    console.log(productsFoundOneLevelUp);
  };
  const debouncedHandleSearch = useCallback(_.debounce(handleSearch, 600), []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    if (value.length > 3) {
      debouncedHandleSearch(value);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type here"
        value={inputValue}
        onChange={handleChange}
        className="input input-bordered w-full max-w-xs"
      />
    </div>
  );
};
