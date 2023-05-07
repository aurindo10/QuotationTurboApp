import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { AddProductButton } from "../atoms/AddProductButton";

const FormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().min(1, "Consumo é obrigatório e deve ser maior que 0"),
  brand: z.string().min(1, "Marca é obrigatório"),
  unit: z.string().min(1, "Unidade é obrigatório"),
});
type FormData = z.infer<typeof FormSchema>;
export const AddProductModal = () => {
  const { user } = useUser();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });
  const { mutateAsync: createProduct } =
    trpc.product.createProduct.useMutation();
  const onSubmit = async (data: FormData) => {
    const empresaId = user?.publicMetadata.idEmpresa as string;
    const createdProduct = await createProduct({
      ...data,
      empresa: empresaId,
    });
    if (createdProduct) {
      console.log("createdProduct", createdProduct);
    }
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <AddProductButton></AddProductButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-50" />
        <Dialog.Content className="data-[state=open]:animate-contentShow bg-neutral fixed top-[50%] left-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
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
            <div className="flex justify-end gap-6">
              <Dialog.Close asChild>
                <button className="btn btn-secondary mt-4">Cancelar</button>
              </Dialog.Close>
              <button className="btn btn-primary mt-4" type="submit">
                Salvar
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
