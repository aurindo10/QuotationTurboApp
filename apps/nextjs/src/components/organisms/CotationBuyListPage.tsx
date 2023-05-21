import { useUser } from "@clerk/nextjs";
import { DotsThreeOutlineVertical, Trash } from "@phosphor-icons/react";
import { trpc } from "../../utils/trpc";
import DropdownMenuDemo from "../molecules/DropDown";
import { useCotacoesStore } from "../../../zustandStore/CotacoesStore";
import { useEffect, useState } from "react";
import DropdownMenuBuyList from "../molecules/DropDownBuyListPage";
import { useBuyListsStore } from "../../../zustandStore/BuyListStore";
import { DeleteBuyListmodal } from "./DeleteBuyListModal";
export const CotationBuyListPage = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    if (buyList.BuyList.length > 0) {
      buyListCount++;
    }
    return (
      <div className="w-full">
        {buyList.BuyList.length > 0 ? (
          <div
            className="card card-compact bg-base-100 w-full max-w-xl shadow-xl"
            key={buyList.id}
          >
            <div className="card-body grid grid-cols-3">
              <div className="col-span-2">
                <h2 className="card-title">{buyList.nome}</h2>
                <h3>{`Enviados: 01/03`}</h3>
              </div>
              <div className="card-actions justify-end">
                <div className="flex flex-col items-center justify-center gap-2">
                  <DropdownMenuBuyList id={buyList.id}></DropdownMenuBuyList>
                  <button
                    className="btn btn-square btn-accent btn-sm"
                    onClick={() => setIsOpen(true)}
                  >
                    <Trash size={22}></Trash>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <DeleteBuyListmodal
          open={isOpen}
          setOpen={setIsOpen}
          cotacaoId={buyList.id}
          cotacaoName={buyList.nome}
        ></DeleteBuyListmodal>
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
    <div className="flex w-full flex-col items-center ">{buyListElement}</div>
  );
};
