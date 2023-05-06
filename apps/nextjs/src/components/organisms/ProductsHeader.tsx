import { AddProductButton } from "../atoms/AddProductButton";

export const ProductsHeader = () => {
  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <label className="w-full text-center text-[30px] font-bold">
          Produtos
        </label>
        <AddProductButton></AddProductButton>
      </div>
    </div>
  );
};
