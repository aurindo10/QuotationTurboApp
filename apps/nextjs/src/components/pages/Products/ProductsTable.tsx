import { AppRouter } from "@acme/api";
import { useUser } from "@clerk/nextjs";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { Item } from "@radix-ui/react-dropdown-menu";
import { inferRouterInputs } from "@trpc/server";
import React, { useState } from "react";
import { useEffect } from "react";
import { useProductsStore } from "../../../../zustandStore/ProductStore";
import { trpc } from "../../../utils/trpc";
import { ProductsTableSkeleton } from "../../SkeletonPages/ProductPageSkeleton";
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
      code: "",
    });

  const [clickedProduct, setClickedProduct] = React.useState<ClickedProduct>({
    id: "",
    nome: "",
  });
  const { data: numberOfProducts, status: loadingNumbersOfProducts } =
    trpc.product.getNumberOfProducts.useQuery();
  const { mutateAsync: getAllProducts, status } =
    trpc.product.getAllProducts.useMutation();
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
  const productsPerPage = 6;
  const numberOfPaginations = Math.ceil(
    (inputValue.length === 0 ? numberOfProducts ?? 0 : allPrducts.length) /
      productsPerPage,
  );

  useEffect(() => {
    const handleGetAllProducts = async () => {
      const data = await getAllProducts({
        skip: (currentPage - 1) * productsPerPage,
        take: productsPerPage,
      });
      addManyProducts(data);
    };
    if (inputValue.length === 0) {
      handleGetAllProducts();
    }
  }, [currentPage, getAllProducts, addManyProducts]);
  return (
    <div className="pb-16">
      {status === "loading" && loadingNumbersOfProducts === "loading" ? (
        <ProductsTableSkeleton />
      ) : allPrducts.length === 0 ? (
        <div className="text-[30px]">Cadastre um produto</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="table w-full ">
            <thead>
              <tr>
                <th className="bg-slate-700">Nome</th>
                <th className="bg-slate-700">Descrição</th>
                <th className="bg-slate-700">Marca</th>
                <th className="bg-slate-700">Código</th>
                <th className="bg-slate-700">Unidade</th>
                <th className="w-8 bg-slate-700 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {allPrducts?.map((product) => {
                return (
                  <tr key={product.id}>
                    <th className="bg-slate-600">
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
                      <label>{product.code}</label>
                    </td>
                    <td>
                      <label>{product.unit}</label>
                    </td>
                    <th className="join">
                      <button
                        className="btn btn-accent  join-item btn-square"
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
                        className="btn btn-warning  join-item btn-square"
                        onClick={() => {
                          setEditModalOpen(true);
                          setInfoModalOpen({
                            ...product,
                            code: product.code ?? "",
                          });
                        }}
                      >
                        <PencilSimple size={24} />
                      </button>
                    </th>
                  </tr>
                );
              })}
            </tbody>
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
      <div className="join flex justify-end">
        {Array.from(Array(numberOfPaginations), (item, index) => {
          return (
            <button
              className="join-item btn btn-sm"
              name="options"
              key={index}
              onClick={() => {
                setCurrentPage(index + 1);
              }}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};
