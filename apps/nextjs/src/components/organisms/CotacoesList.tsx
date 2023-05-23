import { useUser } from "@clerk/nextjs";
import { DotsThreeOutlineVertical, Trash } from "@phosphor-icons/react";
import { trpc } from "../../utils/trpc";
import DropdownMenuDemo from "../molecules/DropDown";
import { useCotacoesStore } from "../../../zustandStore/CotacoesStore";
import { useEffect } from "react";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import { DeleteCotacaoModal } from "./DeleteCotacaoModal";
import React from "react";
const timeZone = "America/Sao_Paulo";
export const CotacoesList = () => {
  const [open, setOpen] = React.useState(false);
  const { user } = useUser();
  const [allCotacoes, addManyCotacoes] = useCotacoesStore((state) => [
    state.allCotacoes,
    state.addManyCotacoes,
  ]);
  const { data, status } = trpc.cotacoes.getCotacoes.useQuery();
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
      {allCotacoes?.length === 0 ? (
        <div className="flex flex-col">
          <label className="text-[30px] font-bold">
            Nenhuma cotação cadastrada
          </label>
          <label>Clique no botão de adicionar para adicionar uma cotação</label>
        </div>
      ) : null}
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
                <h3>{`Enviados: ${
                  cotacao.Representante ? cotacao.Representante.length : 0
                }/${cotacao.ammountOfTradeRepresentative}`}</h3>
                <h3>{`Criado em: ${formattedDate}`}</h3>
              </div>
              <div className="card-actions justify-end">
                <div className="flex flex-col items-center justify-center gap-5">
                  <DropdownMenuDemo id={cotacao.id}></DropdownMenuDemo>
                  <button
                    className="btn btn-square btn-sm btn-accent"
                    onClick={() => setOpen(true)}
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
              <DeleteCotacaoModal
                cotacaoId={cotacao.id}
                cotacaoName={cotacao.nome}
                open={open}
                setOpen={setOpen}
              ></DeleteCotacaoModal>
            </div>
          </div>
        );
      })}
    </div>
  );
};
