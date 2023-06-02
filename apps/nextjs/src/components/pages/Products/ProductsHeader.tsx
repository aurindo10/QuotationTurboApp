import { AddProductModal } from "./AddProductModal";

export const ProductsHeader = () => {
  return (
    <div>
      <div className="fixed bottom-4 right-4 z-50">
        <AddProductModal></AddProductModal>
      </div>
    </div>
  );
};
