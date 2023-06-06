import { Buildings, PencilSimple, Trash, User } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useRouter as pastUseRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { usePageStore } from "../../../../../zustandStore/PageStore";
import { useSentPricesStore } from "../../../../../zustandStore/SentPrices";

import { trpc } from "../../../../utils/trpc";
import { DeletePriceListCotado } from "../RegisteredProducts/DeletePriceListCotado";
import { OneTable } from "./oneTable";

export const SentPricesBody = () => {
  const [setTitle] = usePageStore((state) => [state.setTitle]);
  setTitle("Cotacões enviadas");
  const [open, setOpen] = React.useState(false);
  const [representanteInfo, setRepresentanteInfo] = React.useState({
    representanteId: "",
    representanteName: "",
  });
  const router = useRouter();
  const pastRouter = pastUseRouter();
  const [sentPrices, setSentPrices] = useSentPricesStore((state) => [
    state.sentPrices,
    state.setSentPrices,
  ]);

  const { data, status } =
    trpc.produCotado.getListOfPricesByCotationId.useQuery({
      cotacaoId: pastRouter.query.id as string,
    });
  useEffect(() => {
    if (data) {
      setSentPrices(data);
    }
  }, [data, status]);
  if (status === "loading") {
    return <div className="">loading</div>;
  }
  if (data?.length === 0)
    return (
      <div className="flex w-full items-center justify-center text-[24px] text-slate-400 md:text-[30px]">
        Ninguém enviou cotação ainda!
      </div>
    );
  return (
    <div className="space-y-4">
      {sentPrices?.map((seller) => {
        return (
          <div key={seller.id}>
            <div className="my-2 flex items-center gap-4">
              <div className=" flex items-center gap-2 text-[18px]">
                <User size={32} />
                <label>{`${seller.nome}`}</label>
              </div>
              <div className="flex items-center gap-2 text-[18px] ">
                <Buildings size={32} />
                <label>{`${seller.empresaName}`}</label>
              </div>
              <button
                onClick={() => {
                  setRepresentanteInfo({
                    representanteId: seller.id,
                    representanteName: seller.nome,
                  });
                  setOpen(true);
                }}
                className="btn btn-square btn-accent btn-sm"
              >
                <Trash></Trash>
              </button>
            </div>
            <OneTable key={seller.id} sellerId={seller.id}></OneTable>
          </div>
        );
      })}
      <DeletePriceListCotado
        open={open}
        setOpen={setOpen}
        representanteId={representanteInfo.representanteId}
        representanteName={representanteInfo.representanteName}
      ></DeletePriceListCotado>
    </div>
  );
};
