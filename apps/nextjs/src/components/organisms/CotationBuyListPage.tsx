import { useUser } from "@clerk/nextjs";
import { DotsThreeOutlineVertical, Trash } from "@phosphor-icons/react";
import { trpc } from "../../utils/trpc";
import DropdownMenuDemo from "../molecules/DropDown";
import { useCotacoesStore } from "../../../zustandStore/CotacoesStore";
import { useEffect, useState } from "react";
import DropdownMenuBuyList from "../molecules/DropDownBuyListPage";
import { useBuyListsStore } from "../../../zustandStore/BuyListStore";
import { DeleteBuyListmodal } from "./DeleteBuyListModal";
import { string } from "zod";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
const timeZone = "America/Sao_Paulo";
export const CotationBuyListPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [infoToDeleteModal, setInfoToDeleteModal] = useState({
    cotacaoId: "",
    cotacaoName: "",
  });
  const { user } = useUser();
  const { data, status } =
    trpc.cotacoes.getCotacoesWithProductsCotadosInside.useQuery({
      empresaId: user?.publicMetadata.idEmpresa as string,
    });
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
      <div className="w-full" key={buyList.id}>
        {buyList.BuyList.length > 0 ? (
          <div
            className="card card-compact bg-base-100 w-full max-w-xl shadow-xl"
            key={buyList.id}
          >
            <div className="card-body grid grid-cols-3">
              <div className="col-span-2">
                <h2 className="card-title">{buyList.nome}</h2>
                <h3>{`Criado em: ${formattedDate}`}</h3>
              </div>
              <div className="card-actions justify-end">
                <div className="flex flex-col items-center justify-center gap-2">
                  <DropdownMenuBuyList id={buyList.id}></DropdownMenuBuyList>
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
    <div className="flex w-full flex-col items-center ">
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
