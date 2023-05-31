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
  const [open, setOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [infoModalOpen, setInfoModalOpen] =
    React.useState<UpdateOneProductType>({
      id: "",
      nome: "",
      descricao: "",
      brand: "",
      unit: "",
      code: "",
    });

  const [clickedProduct, setClickedProduct] = React.useState<ClickedProduct>({
    id: "",
    nome: "",
  });

  const idCotacao = router.query.id;
  const [isLoading, setIsloanding] = useState(true);
  const { mutateAsync: getProductsByCotation } =
    trpc.product.getProductsByCotation.useMutation();
  const [addManyProducts, allProducts] = useProductsOfCotationStore((state) => [
    state.addManyProducts,
    state.allProducts,
  ]);
  useEffect(() => {
    if (idCotacao) {
      const productsFromCotation = async () => {
        return await getProductsByCotation({
          cotacaoId: (idCotacao as string) ?? "",
        });
      };
      productsFromCotation().then((data) => {
        addManyProducts(data);
        setIsloanding(false);
      });
    }
  }, [idCotacao, getProductsByCotation]);
  return (
    <div>
      {isLoading ? (
        <ProductsTableSkeleton />
      ) : allProducts.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th className=" bg-slate-700">Nome</th>
                <th className=" bg-slate-700">QTD</th>
                <th className=" bg-slate-700">Unidade</th>
                <th className=" bg-slate-700">Descrição</th>
                <th className=" bg-slate-700">Marca</th>
                <th className=" bg-slate-700">Código</th>
                <th className=" w-8 bg-slate-700 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {allProducts?.map((product) => {
                return (
                  <tr key={product.id}>
                    <th className="bg-slate-600">
                      <div className=" whitespace-normal md:w-full">
                        {product.produto.nome}
                      </div>
                    </th>
                    <td className="bg-slate-900">
                      <div className=" whitespace-normal md:w-full">
                        {product.quantidade}
                      </div>
                    </td>
                    <td className="bg-slate-900">
                      <label>{product.produto.unit}</label>
                    </td>
                    <td className="bg-slate-900">
                      <div className="w-40 whitespace-normal md:w-full">
                        {product.produto.descricao}
                      </div>
                    </td>
                    <td className="bg-slate-900">
                      <label>{product.produto.brand}</label>
                    </td>
                    <td className="bg-slate-900">
                      <label>{product.produto.code}</label>
                    </td>

                    <th className="space-x-3 bg-slate-900">
                      <button
                        className="btn btn-accent btn-sm btn-square"
                        onClick={() => {
                          setOpen(true);
                          setClickedProduct({
                            id: product.id,
                            nome: product.produto.nome,
                          });
                        }}
                      >
                        <Trash size={18} />
                      </button>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full text-center text-[30px]">
          Você ainda não adicionou produtos a esta cotação
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
