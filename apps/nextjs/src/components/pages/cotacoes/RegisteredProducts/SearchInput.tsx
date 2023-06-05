import _ from "lodash";
import { ChangeEvent, useCallback, useState } from "react";
import { useProductsStore } from "../../../../../zustandStore/ProductStore";
import { trpc } from "../../../../utils/trpc";

export const SearchInput = () => {
  const [
    allPrducts,
    addManyProducts,
    currentPage,
    setCurrentPage,
    inputValue,
    setInputValue,
  ] = useProductsStore((state) => [
    state.allPrducts,
    state.addManyProducts,
    state.currentPage,
    state.setCurrentPage,
    state.inputValue,
    state.setInputValue,
  ]);
  const { mutateAsync: findProduct } = trpc.product.searchProduct.useMutation();
  const [isLoading, setIsLoading] = useState("");
  const handleSearch = async (value: string) => {
    setIsLoading("loading");
    const productsFound = await findProduct({
      nome: value,
      take: 6,
      skip: (currentPage - 1) * 6,
    });
    addManyProducts(productsFound);

    setIsLoading("");
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setIsLoading("loading");
    setInputValue(value);
    debouncedHandleSearch(value);
  };
  const debouncedHandleSearch = useCallback(_.debounce(handleSearch, 300), []);

  return (
    <div className="form-control w-full">
      <div className="input-group">
        <input
          type="text"
          placeholder="Procurar..."
          className="input input-bordered w-full"
          value={inputValue}
          onChange={handleChange}
        />
        <button className={`btn btn-square ${isLoading}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
