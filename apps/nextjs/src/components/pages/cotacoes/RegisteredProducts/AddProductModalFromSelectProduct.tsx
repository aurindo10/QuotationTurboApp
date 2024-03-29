import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import router from "next/router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useProductsOfCotationStore } from "../../../../../zustandStore/ProductsOfCotationStore";
import { useProductsStore } from "../../../../../zustandStore/ProductStore";
import { useToastStore } from "../../../../../zustandStore/ToastStore";
import { trpc } from "../../../../utils/trpc";

const FormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().min(0, "Consumo é obrigatório e deve ser maior que 0"),
  brand: z.string().min(1, "Marca é obrigatório"),
  unit: z.string().min(1, "Unidade é obrigatório"),
  code: z.string().min(1, "Código é obrigatório"),
  qtd: z.string().min(1),
});
type FormData = z.infer<typeof FormSchema>;
export const AddProductModalFromCotation = () => {
  const idCotacao = router.query.id;

  const [setToastOpen, setContent] = useToastStore((state) => [
    state.setOpenOnClique,
    state.setContent,
  ]);
  const [addProduct] = useProductsStore((state) => [state.addProduct]);
  const [isLoading, setIsLoading] = React.useState("");
  const [
    productName,
    addProductSate,
    setSelectedProductId,
    setOpenPopoverInput,
  ] = useProductsOfCotationStore((state) => [
    state.productName,
    state.addProduct,
    state.setSelectedProductId,
    state.setOpen,
  ]);
  const [open, setOpen] = React.useState(false);
  const { mutateAsync: addProductToCotacao } =
    trpc.cotacoes.addProductToCotacao.useMutation();
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
      code: "",
    },
  });
  useEffect(() => {
    setValue("nome", productName);
  }, [open, productName, setValue]);
  const { mutateAsync: createProduct } =
    trpc.product.createProduct.useMutation();
  const onSubmit = async (data: FormData) => {
    setIsLoading("loading");
    const createdProduct = await createProduct(data);
    if (createdProduct) {
      const addedProductToCotacao = await addProductToCotacao({
        cotacaoId: idCotacao as string,
        produtoId: createdProduct.id,
        quantidade: Number(data.qtd),
      });
      addProductSate(addedProductToCotacao);
      setSelectedProductId("");
      setOpenPopoverInput(false);
      setToastOpen();
      setContent({
        title: "Produto criado e adicionado com sucesso",
        description: `O produto ${createdProduct.nome} foi criado e adicionado a lista com sucesso`,
        type: "success",
      });
      reset();
      addProduct(createdProduct);
      setIsLoading("");
      setOpen(false);
    }
  };
  return (
    <Dialog.Root open={open} onOpenChange={() => setOpen(!open)}>
      <div>
        <button onClick={() => setOpen(true)} className="btn btn-info w-full">
          Produto não existente, você deseja adicionar?
        </button>
      </div>
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
            <div className="flex w-full gap-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Descrição</span>
                </label>
                <Controller
                  name="descricao"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="textarea textarea-bordered  textarea-xs h-12 w-full"
                      placeholder="Descrição do produto..."
                    ></textarea>
                  )}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Quantidade</span>
                </label>
                <Controller
                  name="qtd"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      placeholder="Quantidade do produto"
                      className="input input-bordered w-full"
                    />
                  )}
                />
              </div>
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
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Código</span>
                </label>
                <Controller
                  name="code"
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
                className={`btn btn-success mt-4 ${isLoading}`}
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
