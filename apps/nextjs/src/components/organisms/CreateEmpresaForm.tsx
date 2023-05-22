import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { Alert } from "../molecules/Alert";
import { useState } from "react";
import { useRouter } from "next/router";
const FormSchemaToCreateEmpresa = z.object({
  nome: z.string().min(5, "Este campo deve ter no mínimo 5 caracteres").max(50),
  cnpj: z.string().min(18, "Preencha todos os dígitos do CNPJ").max(50),
  apelido: z
    .string()
    .min(4, "Este campo deve ter no mínimo 4 caracteres")
    .max(30),
});
type FormData = z.infer<typeof FormSchemaToCreateEmpresa>;
type alertMessage = "success" | "warning" | "error" | null;
export const CreateEmpresaForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState("");
  const [alertMessage, setAlertMessage] = useState<alertMessage>(null);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchemaToCreateEmpresa),
  });
  const { mutateAsync: createEmpresa } =
    trpc.empresa.createEmpresa.useMutation();
  const { mutateAsync: insertIdEmpresaIntoMetaData } =
    trpc.empresa.insertIdEmpresaIntoMetaData.useMutation();
  const onSubmit = async (data: FormData) => {
    setIsLoading("loading");
    setAlertMessage("success");
    const createdEmpresa = await createEmpresa(data);
    if (createdEmpresa) {
      router.replace("/cotacoes");
      const userupdated = await insertIdEmpresaIntoMetaData({
        active: createdEmpresa.active!,
        idEmpresa: createdEmpresa.id,
        nomeEmpresa: createdEmpresa.nome,
      });
    }
  };
  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    let formatted = cleaned;

    if (cleaned.length >= 3) {
      formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    }
    if (cleaned.length >= 6) {
      formatted = `${formatted.slice(0, 6)}.${formatted.slice(6)}`;
    }
    if (cleaned.length >= 10) {
      formatted = `${formatted.slice(0, 10)}/${formatted.slice(10)}`;
    }
    if (cleaned.length >= 14) {
      formatted = `${formatted.slice(0, 15)}-${formatted.slice(15, 17)}`;
    }

    return formatted;
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col items-center justify-center"
    >
      <div className="form-control w-full md:max-w-md">
        <label className="label flex">
          <span className="label-text">Nome da empresa</span>
        </label>
        <label className="input-group">
          <span>Nome</span>
          <Controller
            name="nome"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Empresa A"
                className="input input-bordered input-primary w-full  md:max-w-md"
              />
            )}
          />
        </label>
      </div>
      <div className="form-control w-full md:max-w-md">
        <label className="label">
          <span className="label-text">CNPJ da Empresa</span>
        </label>
        <label className="input-group">
          <span>CNPJ</span>
          <Controller
            name="cnpj"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="00.000.00/0001-05"
                className="input input-bordered input-primary w-full md:max-w-md"
                onChange={(event) => {
                  field.onChange(formatCNPJ(event.target.value));
                }}
              />
            )}
          />
        </label>
      </div>
      <div className="form-control w-full md:max-w-md">
        <label className="label">
          <span className="label-text">Idenficador</span>
        </label>
        <label className="input-group">
          <span className="w-[82px]">ID</span>
          <Controller
            name="apelido"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="EMPRESA123456"
                className="input input-bordered input-primary w-full md:max-w-md"
              />
            )}
          />
        </label>
      </div>
      <div className="h-5">
        <span className="text-center text-xs text-red-600">
          {errors.nome?.message ||
            errors.cnpj?.message ||
            errors.apelido?.message}
        </span>
      </div>
      <div className="flex w-full flex-col items-center justify-center md:max-w-md">
        <button
          type="submit"
          disabled={isLoading === "loading" ? true : false}
          className={`btn btn-primary my-2 w-full md:max-w-md `}
        >
          Criar Empresa
        </button>
        <div className="h-20">
          <button
            className={`btn btn-square my-2 ${isLoading} ${
              isLoading ? "" : "hidden"
            }`}
          ></button>
        </div>
      </div>
    </form>
  );
};
