import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { Button } from "@mui/material";
const FormSchemaToCreateEmpresa = z.object({
  nome: z.string().min(3).max(30),
  cnpj: z.string().min(14).max(14),
  apelido: z.string().min(3).max(30),
});
type FormData = z.infer<typeof FormSchemaToCreateEmpresa>;
export const CreateEmpresaForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchemaToCreateEmpresa),
  });
  const { mutateAsync: createEmpresa } =
    trpc.empresa.createEmpresa.useMutation();
  const onSubmit = async (data: FormData) => {};
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Nome da empresa</span>
        </label>
        <label className="input-group">
          <span>Nome</span>
          <input
            type="text"
            placeholder="Empresa A"
            className="input input-bordered input-primary"
          />
        </label>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">CNPJ da Empresa</span>
        </label>
        <label className="input-group">
          <span>CNPJ</span>
          <input
            type="text"
            placeholder="Empresa A"
            className="input input-bordered input-primary"
          />
        </label>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Idenficador</span>
        </label>
        <label className="input-group">
          <span className="w-[70px]">ID</span>
          <input
            type="text"
            placeholder="Empresa A"
            className="input input-bordered input-primary"
          />
        </label>
      </div>
      <div>
        <button type="submit" className="btn btn-primary my-2 w-full">
          Criar Empresa
        </button>
      </div>
    </form>
  );
};
