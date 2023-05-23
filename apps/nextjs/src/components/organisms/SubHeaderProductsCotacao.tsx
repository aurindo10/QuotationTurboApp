import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useProductsOfCotationStore } from "../../../zustandStore/ProductsOfCotationStore";
import { useToastStore } from "../../../zustandStore/ToastStore";
import { trpc } from "../../utils/trpc";
import { SelectInputProduct } from "../molecules/SelectInputProduct";

const formSchemaToAddProductToCotacao = z.object({
  quantidade: z.number().min(0.01, "Este campo deve ter no mínimo 0.01"),
});
export const SubHeaderProductsCotacao = () => {
  const [setToastOpen, setContent] = useToastStore((state) => [
    state.setOpenOnClique,
    state.setContent,
  ]);
  const [isLoading, setIsloanding] = useState("");
  const router = useRouter();
  const idCotacao = router.query.id;

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
            <span>{selectedProduct.unit}</span>
          </label>
          <div className="my-2 flex items-center justify-between">
            <div>
              <span className="text-[20px]">Marca: </span>
              <span className="text-accent text-[20px]">
                {selectedProduct.brand}
              </span>
            </div>
            <span className="text-center text-xs text-red-600">
              {errors.quantidade?.message}
            </span>
            <button type="submit" className={`btn btn-primary ${isLoading}`}>
              Adicionar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
