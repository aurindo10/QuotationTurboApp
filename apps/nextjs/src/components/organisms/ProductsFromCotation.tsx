export function TableOfProductsOfCotation() {
  return <div></div>;
}
import { AppRouter } from "@acme/api";
import { useUser } from "@clerk/nextjs";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { inferRouterInputs } from "@trpc/server";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import { useProductsOfCotationStore } from "../../../zustandStore/ProductsOfCotationStore";
import { useProductsStore } from "../../../zustandStore/ProductStore";
import { trpc } from "../../utils/trpc";
import { ProductsTableSkeleton } from "../SkeletonPages/ProductPageSkeleton";
import { DeleteProductCotationModal } from "./DeleteProductCotationModal";
import { DeleteProductModal } from "./DeleteProductModal";
import { EditProductModal } from "./EditProductModal";
interface ClickedProduct {
  id: string;
  nome: string;
}
type RouterInput = inferRouterInputs<AppRouter>;
export type UpdateOneProductType = RouterInput["product"]["updateOneProduct"];

export const ProductsTableCotation = () => {
  const router = useRouter();
  const { user } = useUser();
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

  const idCotacao = router.query.id;
  const [isLoading, setIsloanding] = useState(true);
  const idEmpresa = user?.publicMetadata.idEmpresa as string;
  const { mutateAsync: getProductsByCotation } =
    trpc.product.getProductsByCotation.useMutation();
  const [addManyProducts, allProducts] = useProductsOfCotationStore((state) => [
    state.addManyProducts,
    state.allProducts,
  ]);
  useEffect(() => {
    if (idEmpresa && idCotacao) {
      const productsFromCotation = async () => {
        return await getProductsByCotation({
          cotacaoId: (idCotacao as string) ?? "",
          idEmpresa: idEmpresa,
        });
      };
      productsFromCotation().then((data) => {
        addManyProducts(data);
        setIsloanding(false);
      });
    }
  }, [idEmpresa, idCotacao, getProductsByCotation]);
  return (
    <div>
      {isLoading ? (
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
              {allProducts?.map((product) => {
                return (
                  <tr key={product.id}>
                    <th>
                      <div className="w-32 whitespace-normal md:w-full">
                        {product.produto.nome}
                      </div>
                    </th>
                    <td>
                      <div className="w-40 whitespace-normal md:w-full">
                        {product.produto.descricao}
                      </div>
                    </td>
                    <td>
                      <label>{product.produto.brand}</label>
                    </td>
                    <td>
                      <label>{product.produto.unit}</label>
                    </td>
                    <th className="space-x-3">
                      <button
                        className="btn btn-accent  btn-square"
                        onClick={() => {
                          setOpen(true);
                          setClickedProduct({
                            id: product.id,
                            nome: product.produto.nome,
                          });
                        }}
                      >
                        <Trash size={24} />
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
      <DeleteProductCotationModal
        open={open}
        productName={clickedProduct.nome}
        productId={clickedProduct.id}
        setOpen={setOpen}
      ></DeleteProductCotationModal>
      <EditProductModal
        product={infoModalOpen}
        setOpen={setEditModalOpen}
        open={editModalOpen}
      ></EditProductModal>
    </div>
  );
};
