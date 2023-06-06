import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Share } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import React from "react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useProductsOfCotationStore } from "../../../../../zustandStore/ProductsOfCotationStore";
import { useToastStore } from "../../../../../zustandStore/ToastStore";
import { trpc } from "../../../../utils/trpc";
import { CopyAndPasteModal } from "../index/CopyPasteModal";
import { SelectInputProduct } from "./SelectInputProduct";

const formSchemaToAddProductToCotacao = z.object({
  quantidade: z.number().min(0.01, "Este campo deve ter no mínimo 0.01"),
});
export const SubHeaderProductsCotacao = () => {
  const [openCopyAndPasteModal, setOpenCopyAndPasteModal] =
    React.useState(false);
  const [setToastOpen, setContent] = useToastStore((state) => [
    state.setOpenOnClique,
    state.setContent,
  ]);
  const [isLoading, setIsloanding] = useState("");
  const router = useRouter();
  const idCotacao = router.query.id;
  const buttonSendRef = useRef<HTMLButtonElement>(null);

  type FormData = z.infer<typeof formSchemaToAddProductToCotacao>;
  const { mutateAsync: addProductToCotacao } =
    trpc.cotacoes.addProductToCotacao.useMutation();
  const [
    selectedProduct,
    addProduct,
    resetSelectedProduct,
    setSelectedProduct,
    addProductToSearchState,
    setSelectedProductId,
  ] = useProductsOfCotationStore((state) => [
    state.selectedProduct,
    state.addProduct,
    state.resetSelectedProduct,
    state.setSelectedProduct,
    state.addProductToSearchState,
    state.setSelectedProductId,
  ]);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchemaToAddProductToCotacao),
    defaultValues: {
      quantidade: 0,
    },
  });
  const onSubmit = async (data: FormData) => {
    setIsloanding("loading");
    if (selectedProduct.id) {
      const createdProduct = await addProductToCotacao({
        ...data,
        cotacaoId: (idCotacao as string) ?? "",
        produtoId: selectedProduct.id,
      });

      if (createdProduct) {
        addProduct(createdProduct);
        setIsloanding("");
        reset();
        setToastOpen();
        resetSelectedProduct();
        addProductToSearchState([]);
        setSelectedProduct();
        setSelectedProductId("");
        setContent({
          title: "Produto adicionado",
          description: `O produto foi adicionado com sucesso`,
          type: "success",
        });
      }
    }
    if (!selectedProduct.id) {
      setIsloanding("");
      setToastOpen();
      setContent({
        title: "Selecione um produto",
        description: `Você deve selecionar um produto para adicionar a cotação`,
        type: "error",
      });
    }
  };
  return (
    <div className="w-full">
      <div className="mb-[-20px] flex w-full justify-end">
        <button
          ref={buttonSendRef}
          className="btn btn-warning btn-sm z-50"
          onClick={() => {
            setOpenCopyAndPasteModal(true);
          }}
        >
          <Share size={18} />
          <label
            className="text-[12px] font-bold"
            onClick={() => buttonSendRef.current?.click()}
          >
            Compartilhar
          </label>
        </button>
      </div>

      <form
        className="flex w-full flex-col items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <SelectInputProduct></SelectInputProduct>
        <div className="form-control w-[300px]">
          <label className="label">
            <span className="label-text">Insira a quantidade</span>
          </label>
          <label className="input-group">
            <Controller
              name="quantidade"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min={0}
                  onChange={(e) => {
                    if (e.target.value === "") return field.onChange("");
                    field.onChange(parseInt(e.target.value));
                  }}
                  placeholder="0.01"
                  className="input input-bordered w-full"
                />
              )}
            />
            <span>{selectedProduct.unit ? selectedProduct.unit : "Uni"}</span>
          </label>
          <div className="my-2 flex items-center justify-between">
            <div>
              <span className="text-[20px]">Marca: </span>
              <span className="text-accent text-[20px]">
                {selectedProduct.brand ? selectedProduct.brand : "Marca"}
              </span>
            </div>

            <button type="submit" className={`btn btn-secondary ${isLoading}`}>
              Adicionar
            </button>
          </div>
          <span className="mt-[-4px] h-4 text-center text-xs text-red-600">
            {errors.quantidade?.message}
          </span>
        </div>
      </form>
      <CopyAndPasteModal
        cotacaoId={(router.query.id as string) ?? ""}
        open={openCopyAndPasteModal}
        setOpen={setOpenCopyAndPasteModal}
      ></CopyAndPasteModal>
    </div>
  );
};
