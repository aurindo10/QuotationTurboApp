import { useUser } from "@clerk/nextjs";
import { DotsThreeOutlineVertical } from "@phosphor-icons/react";
import { trpc } from "../../utils/trpc";
import DropdownMenuDemo from "../molecules/DropDown";
import { useCotacoesStore } from "../../../zustandStore/CotacoesStore";
import { useEffect } from "react";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
const timeZone = "America/Sao_Paulo";
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
    <div className="flex w-full flex-col items-center gap-3">
      {allCotacoes?.map((cotacao) => {
        const zonedDate = utcToZonedTime(cotacao.createdAt!, timeZone);
        const formattedDate = format(zonedDate, "dd/MM/yyyy");
        return (
          <div
            className="card card-compact bg-base-100 w-full max-w-xl shadow-xl"
            key={cotacao.id}
          >
            <div className="card-body grid grid-cols-3">
              <div className="col-span-2">
                <h2 className="card-title">{cotacao.nome}</h2>
                <h3>{`Enviados: ${cotacao.Representante.length}/${cotacao.ammountOfTradeRepresentative}`}</h3>
                <h3>{`Criado em: ${formattedDate}`}</h3>
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
