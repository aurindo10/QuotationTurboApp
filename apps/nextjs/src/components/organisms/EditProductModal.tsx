import { AppRouter } from "@acme/api";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useProductsStore } from "../../../zustandStore/ProductStore";
import { useToastStore } from "../../../zustandStore/ToastStore";
import { trpc } from "../../utils/trpc";
import { UpdateOneProductType } from "./ProductsTable";

const FormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().min(1, "Consumo é obrigatório e deve ser maior que 0"),
  brand: z.string().min(1, "Marca é obrigatório"),
  unit: z.string().min(1, "Unidade é obrigatório"),
});
type FormData = z.infer<typeof FormSchema>;
type RouterOutput = inferRouterOutputs<AppRouter>;
export type ProductType = RouterOutput["product"]["getAllProducts"][0];
interface EditProductModal {
  product: UpdateOneProductType;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const EditProductModal = ({
  product,
  open,
  setOpen,
}: EditProductModal) => {
  const [setToastOpen, setContent] = useToastStore((state) => [
    state.setOpenOnClique,
    state.setContent,
  ]);
  const [updateProductState] = useProductsStore((state) => [
    state.updateProduct,
  ]);
  const [isLoading, setIsLoading] = React.useState("");
  const { user } = useUser();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      brand: "",
      unit: "",
    },
  });
  useEffect(() => {
    setValue("nome", product.nome);
    setValue("descricao", product.descricao);
    setValue("brand", product.brand);
    setValue("unit", product.unit);
  }, [product]);

  const { mutateAsync: updateOneProduct } =
    trpc.product.updateOneProduct.useMutation();
  const onSubmit = async (data: FormData) => {
    setIsLoading("loading");
    const empresaId = user?.publicMetadata.idEmpresa as string;
    const updatedProduct = await updateOneProduct({
      ...data,
      id: product.id,
    });
    if (updatedProduct) {
      setToastOpen();
      setContent({
        title: "Produto atualizado com sucesso",
        description: `O produto ${updatedProduct.nome} foi atualizado com sucesso`,
        type: "success",
      });
      reset();
      updateProductState(updatedProduct);
      setIsLoading("");
      setOpen(false);
    }
  };
  return (
    <Dialog.Root open={open} onOpenChange={() => setOpen(!open)}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-50" />
        <Dialog.Content
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="data-[state=open]:animate-contentShow bg-neutral fixed top-[50%] left-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
        >
          <form className="grid" onSubmit={handleSubmit(onSubmit)}>
            <h3 className="mb-4 text-lg font-bold">
              Digite as informações do produto
            </h3>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Nome do Produto</span>
              </label>
              <Controller
                name="nome"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Digite o nome do produto"
                    className="input input-bordered w-full"
                  />
                )}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Descrição do Produto</span>
              </label>
              <Controller
                name="descricao"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="textarea textarea-bordered h-24"
                    placeholder="Descrição do produto..."
                  ></textarea>
                )}
              />
            </div>
            <div className="flex gap-2">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Marca</span>
                </label>
                <Controller
                  name="brand"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Digite aqui.."
                      className="input input-bordered w-full max-w-xs"
                    />
                  )}
                />
              </div>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Unidade</span>
                </label>
                <Controller
                  name="unit"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Digite aqui.."
                      className="input input-bordered w-full max-w-xs"
                    />
                  )}
                />
              </div>
            </div>
            <span className="text-center text-xs text-red-600">
              {errors.nome?.message ||
                errors.brand?.message ||
                errors.descricao?.message ||
                errors.unit?.message}
            </span>
            <div className="flex justify-end gap-6">
              <button
                className="btn btn-secondary mt-4"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>
              <button
                className={`btn btn-primary mt-4 ${isLoading}`}
                type="submit"
              >
                Salvar
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
