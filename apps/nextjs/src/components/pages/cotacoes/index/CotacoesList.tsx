import { useUser } from "@clerk/nextjs";
import {
  AlignLeft,
  DotsThreeOutlineVertical,
  FolderOpen,
  Share,
  Trash,
} from "@phosphor-icons/react";
import { trpc } from "../../../../utils/trpc";
import DropdownMenuDemo from "./DropDown";
import { useCotacoesStore } from "../../../../../zustandStore/CotacoesStore";
import { useEffect, useRef, useState } from "react";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import { DeleteCotacaoModal } from "./DeleteCotacaoModal";
import React from "react";
import { CopyAndPasteModal } from "./CopyPasteModal";
import Link from "next/link";
import { AddCotacaoModal } from "./AddCotacaoModal";
const timeZone = "America/Sao_Paulo";
export const CotacoesList = () => {
  const buttonSendRef = useRef<HTMLButtonElement>(null);
  const buttonOpenRef = useRef<HTMLAnchorElement>(null);

  const [openCopyAndPasteModal, setOpenCopyAndPasteModal] =
    React.useState(false);
  const [openDeletemodal, setOpenDeleteModal] = useState(false);
  const [infoToDeleteModal, setInfoToDeleteModal] = React.useState({
    id: "",
    nome: "",
  });
  const [idCotacao, setIdCotacao] = useState("");

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
    <div>
      <AddCotacaoModal></AddCotacaoModal>
      <div className="mt-2 flex w-full flex-col items-center gap-3 pb-20 md:flex-row">
        {allCotacoes?.length === 0 ? (
          <div className="flex flex-col">
            <label className="text-[30px] font-bold">
              Nenhuma cotação cadastrada
            </label>
            <label>
              Clique no botão de adicionar para adicionar uma cotação
            </label>
          </div>
        ) : null}
        {allCotacoes?.map((cotacao) => {
          const zonedDate = utcToZonedTime(cotacao.createdAt!, timeZone);
          const formattedDate = format(zonedDate, "dd/MM/yyyy");
          return (
            <div
              className="w-full max-w-[360px] rounded-lg bg-slate-700 py-4 px-1 shadow-2xl "
              key={cotacao.id}
            >
              <div className="grid grid-cols-[auto_150px_1fr_1fr]">
                <div className="text-gray-800">
                  <AlignLeft className="h-auto w-auto" size={65} />
                </div>
                <div className="ml-2 flex flex-col items-start">
                  <label className="text-[24px] font-bold text-slate-50">
                    {cotacao.nome}
                  </label>
                  <div className="flex gap-2">
                    <div className="flex flex-col items-start">
                      <label className="text-[8px] font-bold">{`Enviados: ${
                        cotacao.Representante ? cotacao.Representante.length : 0
                      }/${cotacao.ammountOfTradeRepresentative}`}</label>
                      <label className="text-[8px] font-bold">{`Criado em: ${formattedDate}`}</label>
                    </div>
                    <button
                      className="text-red-500"
                      onClick={() => {
                        setInfoToDeleteModal({
                          id: cotacao.id,
                          nome: cotacao.nome,
                        });
                        setOpenDeleteModal(true);
                      }}
                    >
                      <Trash size={24} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <button
                    ref={buttonSendRef}
                    className="btn btn-square btn-ghost flex flex-col items-center text-center"
                    onClick={() => {
                      setIdCotacao(cotacao.id);
                      setOpenCopyAndPasteModal(true);
                    }}
                  >
                    <Share size={40} />
                  </button>
                  <label
                    className="text-[15px] font-bold text-slate-50"
                    onClick={() => buttonSendRef.current?.click()}
                  >
                    Enviar
                  </label>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Link
                    ref={buttonOpenRef}
                    href={`/cotacoes/onecotacao/${cotacao.id}`}
                    className="btn btn-square btn-ghost flex flex-col items-center text-center"
                  >
                    <FolderOpen size={40} />
                  </Link>
                  <label
                    className="text-[15px] font-bold text-slate-50"
                    onClick={() => buttonOpenRef.current?.click()}
                  >
                    Abrir
                  </label>
                </div>
              </div>
            </div>
          );
        })}
        <CopyAndPasteModal
          cotacaoId={idCotacao}
          open={openCopyAndPasteModal}
          setOpen={setOpenCopyAndPasteModal}
        ></CopyAndPasteModal>
        <DeleteCotacaoModal
          cotacaoId={infoToDeleteModal.id}
          cotacaoName={infoToDeleteModal.nome}
          open={openDeletemodal}
          setOpen={setOpenDeleteModal}
        ></DeleteCotacaoModal>
      </div>
    </div>
  );
};
