import { AddProductModal } from "./AddProductModal";

export const ProductsHeader = () => {
  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <label className="w-full text-center text-[30px] font-bold">
          Produtos
        </label>
        <AddProductModal></AddProductModal>
      </div>
    </div>
  );
};
