import { AppRouter } from "@acme/api";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { inferRouterInputs } from "@trpc/server";
import React from "react";
import { useEffect } from "react";
import { useProductsStore } from "../../../zustandStore/ProductStore";
import { trpc } from "../../utils/trpc";
import { ProductsTableSkeleton } from "../SkeletonPages/ProductPageSkeleton";
import { DeleteProductModal } from "./DeleteProductModal";
import { EditProductModal } from "./EditProductModal";
interface ClickedProduct {
  id: string;
  nome: string;
}
type RouterInput = inferRouterInputs<AppRouter>;
export type UpdateOneProductType = RouterInput["product"]["updateOneProduct"];
export const ProductsTabe = () => {
  const [open, setOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [infoModalOpen, setInfoModalOpen] =
    React.useState<UpdateOneProductType>({
      id: "",
      nome: "",
      descricao: "",
      brand: "",
      unit: "",
    });

  const [clickedProduct, setClickedProduct] = React.useState<ClickedProduct>({
    id: "",
    nome: "",
  });

  const { data, status } = trpc.product.getAllProducts.useQuery();
  const [allPrducts, addManyProducts] = useProductsStore((state) => [
    state.allPrducts,
    state.addManyProducts,
  ]);
  useEffect(() => {
    if (status === "success") {
      addManyProducts(data);
    }
  }, [data, status]);
  return (
    <div>
      {status === "loading" ? (
        <ProductsTableSkeleton />
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="table-zebra table w-full ">
            {/* head */}
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Marca</th>
                <th>Unidade</th>
                <th className="w-8 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {allPrducts?.map((product) => {
                return (
                  <tr key={product.id}>
                    <th>
                      <div className="w-32 whitespace-normal md:w-full">
                        {product.nome}
                      </div>
                    </th>
                    <td>
                      <div className="w-40 whitespace-normal md:w-full">
                        {product.descricao}
                      </div>
                    </td>
                    <td>
                      <label>{product.brand}</label>
                    </td>
                    <td>
                      <label>{product.unit}</label>
                    </td>
                    <th className="space-x-3">
                      <button
                        className="btn btn-accent  btn-square"
                        onClick={() => {
                          setOpen(true);
                          setClickedProduct({
                            id: product.id,
                            nome: product.nome,
                          });
                        }}
                      >
                        <Trash size={24} />
                      </button>
                      <button
                        className="btn btn-warning  btn-square"
                        onClick={() => {
                          setEditModalOpen(true);
                          setInfoModalOpen(product);
                        }}
                      >
                        <PencilSimple size={24} />
                      </button>
                    </th>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Marca</th>
                <th>Unidade</th>
                <th className="w-8 text-center">Ações</th>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      <DeleteProductModal
        open={open}
        productName={clickedProduct.nome}
        productId={clickedProduct.id}
        setOpen={setOpen}
      ></DeleteProductModal>
      <EditProductModal
        product={infoModalOpen}
        setOpen={setEditModalOpen}
        open={editModalOpen}
      ></EditProductModal>
    </div>
  );
};