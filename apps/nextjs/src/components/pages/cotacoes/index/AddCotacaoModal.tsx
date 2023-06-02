import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useCotacoesStore } from "../../../../../zustandStore/CotacoesStore";
import { useProductsStore } from "../../../../../zustandStore/ProductStore";
import { useToastStore } from "../../../../../zustandStore/ToastStore";
import { trpc } from "../../../../utils/trpc";

const FormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  ammountOfTradeRepresentative: z
    .number()
    .min(0, "Representantes é obrigatório"),
});
type FormData = z.infer<typeof FormSchema>;
export const AddCotacaoModal = () => {
  const [setToastOpen, setContent] = useToastStore((state) => [
    state.setOpenOnClique,
    state.setContent,
  ]);
  const [allPrducts, addProduct] = useProductsStore((state) => [
    state.allPrducts,
    state.addProduct,
  ]);
  const [isLoading, setIsLoading] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [addCotacao] = useCotacoesStore((state) => [state.addCotacao]);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nome: "",
      ammountOfTradeRepresentative: 0,
    },
  });
  const { mutateAsync: createCotacao } =
    trpc.cotacoes.createCotacao.useMutation();
  const onSubmit = async (data: FormData) => {
    setIsLoading("loading");
    const createdCotacao = await createCotacao(data);
    if (createdCotacao) {
      addCotacao(createdCotacao);
      setToastOpen();
      setContent({
        title: "Produto criado com sucesso",
        description: `O produto ${createdCotacao.nome} foi criado com sucesso`,
        type: "success",
      });
      reset();
      setIsLoading("");
      setOpen(false);
    }
  };
  return (
    <Dialog.Root open={open} onOpenChange={() => setOpen(!open)}>
      <div>
        <button
          onClick={() => setOpen(true)}
          className="btn btn-primary btn-circle btn-lg z-50"
        >
          <Plus size={32} />
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
              Digite as informações da Cotação
            </h3>
            <div className="flex gap-4">
              <div className="form-control w-2/3">
                <label className="label">
                  <span className="label-text">Nome da Cotação</span>
                </label>
                <Controller
                  name="nome"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Digite o nome da Cotação"
                      className="input input-bordered w-full"
                    />
                  )}
                />
              </div>
              <div className="form-control w-1/3">
                <label className="label">
                  <span className="label-text">Representantes</span>
                </label>
                <Controller
                  name="ammountOfTradeRepresentative"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value));
                      }}
                      placeholder="0"
                      className="input input-bordered w-full"
                    />
                  )}
                />
              </div>
            </div>
            <span className="text-center text-xs text-red-600">
              {errors.nome?.message ||
                errors.ammountOfTradeRepresentative?.message}
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
