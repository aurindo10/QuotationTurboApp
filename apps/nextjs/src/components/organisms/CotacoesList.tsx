import { useUser } from "@clerk/nextjs";
import { DotsThreeOutlineVertical } from "@phosphor-icons/react";
import { trpc } from "../../utils/trpc";
import DropdownMenuDemo from "../molecules/DropDown";
import { useCotacoesStore } from "../../../zustandStore/CotacoesStore";
import { useEffect } from "react";
export const CotacoesList = () => {
  const { user } = useUser();
  const [allCotacoes, addManyCotacoes] = useCotacoesStore((state) => [
    state.allCotacoes,
    state.addManyCotacoes,
  ]);

  const { data, status } = trpc.cotacoes.getCotacoes.useQuery({
    empresaId: user?.publicMetadata.idEmpresa as string,
  });
  useEffect(() => {
    if (status === "success") {
      addManyCotacoes(data);
    }
  }, [status, data]);
  if (status === "loading") {
    return <div>loading</div>;
  }
  return (
    <div className="flex w-full flex-col items-center ">
      {allCotacoes?.map((cotacao) => {
        return (
          <div
            className="card card-compact bg-base-100 w-full max-w-xl shadow-xl"
            key={cotacao.id}
          >
            <div className="card-body grid grid-cols-3">
              <div className="col-span-2">
                <h2 className="card-title">{cotacao.nome}</h2>
                <h3>{`Enviados: 01/03`}</h3>
                <h3>Criado: 04/03/2023</h3>
              </div>
              <div className="card-actions justify-end">
                <DropdownMenuDemo id={cotacao.id}></DropdownMenuDemo>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
