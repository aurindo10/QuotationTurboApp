import { useUser } from "@clerk/nextjs";
import {
  DotsThreeOutlineVertical,
  FolderOpen,
  Trash,
} from "@phosphor-icons/react";
import { trpc } from "../../../utils/trpc";
import DropdownMenuDemo from "../cotacoes/index/DropDown";
import { useCotacoesStore } from "../../../../zustandStore/CotacoesStore";
import { useEffect, useRef, useState } from "react";
import DropdownMenuBuyList from "./DropDownBuyListPage";
import { useBuyListsStore } from "../../../../zustandStore/BuyListStore";
import { DeleteBuyListmodal } from "./DeleteBuyListModal";
import { string } from "zod";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import Link from "next/link";
const timeZone = "America/Sao_Paulo";
export const CotationBuyListPage = () => {
  const buttonOpenRef = useRef<HTMLAnchorElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [infoToDeleteModal, setInfoToDeleteModal] = useState({
    cotacaoId: "",
    cotacaoName: "",
  });
  const { data, status } =
    trpc.cotacoes.getCotacoesWithProductsCotadosInside.useQuery();
  const [allBuiesList, addManyBuyList] = useBuyListsStore((state) => [
    state.allBuiesList,
    state.addManyBuyList,
  ]);
  useEffect(() => {
    if (status === "success") {
      addManyBuyList(data);
    }
  }, [status, data]);
  if (status === "loading") {
    return <div>loading</div>;
  }
  let buyListCount = 0;
  const buyListElement = allBuiesList?.map((buyList) => {
    const zonedDate = utcToZonedTime(buyList.createdAt!, timeZone);
    const formattedDate = format(zonedDate, "dd/MM/yyyy");
    if (buyList.BuyList.length > 0) {
      buyListCount++;
    }
    return (
      <div className="flex w-full gap-2 md:flex-col" key={buyList.id}>
        {buyList.BuyList.length > 0 ? (
          <div
            className="card card-compact w-full max-w-[420px] bg-slate-700 shadow-xl  "
            key={buyList.id}
          >
            <div className="card-body grid grid-cols-3 ">
              <div className="col-span-2 space-y-2">
                <div className="flex items-center gap-4">
                  <h2 className="card-title">{buyList.nome}</h2>
                  <button
                    className="btn btn-square btn-accent btn-sm"
                    onClick={() => {
                      setIsOpen(true);
                      setInfoToDeleteModal({
                        cotacaoId: buyList.id,
                        cotacaoName: buyList.nome,
                      });
                    }}
                  >
                    <Trash size={22}></Trash>
                  </button>
                </div>

                <h3>{`Criado em: ${formattedDate}`}</h3>
              </div>
              <div className="card-actions justify-end">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex flex-col items-center text-center">
                    <Link
                      ref={buttonOpenRef}
                      href={`/buylist/products/${buyList.id}`}
                      className="btn btn-square flex flex-col items-center text-center"
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
            </div>
          </div>
        ) : null}
      </div>
    );
  });
  if (buyListCount === 0) {
    return (
      <div className="w-full text-center text-[30px]">
        Não foi gerada nenhuma lista de compra ainda
      </div>
    );
  }
  return (
    <div className="">
      {buyListElement}
      <DeleteBuyListmodal
        open={isOpen}
        setOpen={setIsOpen}
        cotacaoId={infoToDeleteModal.cotacaoId}
        cotacaoName={infoToDeleteModal.cotacaoName}
      ></DeleteBuyListmodal>
    </div>
  );
};
