import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../../utils/trpc";

const FormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  empresaName: z.string().min(1, "Nome da empresa é obrigatório"),
});
type FormData = z.infer<typeof FormSchema>;
export default function Register() {
  const [isLoading, setIsLoading] = useState("");
  const router = useRouter();
  const { user } = useUser();
  const { mutateAsync: createRepresentante } =
    trpc.representante.createRepresentante.useMutation();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nome: "",
      empresaName: "",
    },
  });
  const empresaId = user?.publicMetadata.idEmpresa as string;
  const cotacaoId = router.query.id as string;
  const onSubmit = async (data: FormData) => {
    if (!isLoading) {
      console.log("okok");
      setIsLoading("loading");
      const createdRepresentante = await createRepresentante({
        ...data,
        empresaId: empresaId,
        cotacaoId: cotacaoId,
      });
      if (createdRepresentante) {
        router.push({
          pathname: "/preenchimento/",
          query: {
            idRepresentante: createdRepresentante.id,
            idCotacao: cotacaoId,
            empresaId: empresaId,
          },
        });
      }
      return createdRepresentante;
    }
  };
  return (
    <form
      className="h-screen w-full px-2 md:px-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Seu Nome</span>
          </label>
          <Controller
            name="nome"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="João de Deus"
                className="input input-bordered w-full"
              />
            )}
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Sua Empresa</span>
          </label>
          <Controller
            name="empresaName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Roofe"
                className="input input-bordered w-full"
              />
            )}
          />
        </div>
        <span className="my-2 h-4 text-center text-xs text-red-600">
          {errors.nome?.message || errors.empresaName?.message}
        </span>
        <button type="submit" className={`btn btn-primary ${isLoading}`}>
          Preencher valores
        </button>
      </div>
    </form>
  );
}
