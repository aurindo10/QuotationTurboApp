import { Buildings, PencilSimple, Trash, User } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useRouter as pastUseRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useSentPricesStore } from "../../../../../zustandStore/SentPrices";

import { trpc } from "../../../../utils/trpc";
import { DeletePriceListCotado } from "../RegisteredProducts/DeletePriceListCotado";

export const SentPricesBody = () => {
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
            <div className="space-y-2">
              <div className="w-full overflow-x-auto">
                <table className="table w-full ">
                  {/* head */}
                  <thead>
                    <tr>
                      <th className="w-56 bg-slate-700">Nome</th>
                      <th className="bg-slate-700">Valor</th>
                      <th className="w-56 bg-slate-700">Marca</th>
                      <th className="w-56 bg-slate-700">Código</th>
                      <th className="w-56 bg-slate-700">Unidade</th>
                      <th className="w-56 bg-slate-700">Descrição</th>
                    </tr>
                  </thead>
                  {seller.produtoCotado.map((product) => {
                    function formatarParaReal(numero: number): string {
                      return numero.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      });
                    }
                    return (
                      <tbody key={product.id}>
                        <tr key={product.id}>
                          <th className="bg-slate-600">
                            <div className="w-32 whitespace-normal md:w-full">
                              {product.produtoDaCotacao.produto.nome}
                            </div>
                          </th>
                          <td className="bg-slate-900">
                            <label>
                              {formatarParaReal(product.valor ?? 0)}
                            </label>
                          </td>

                          <td className="bg-slate-900">
                            <label>
                              {product.produtoDaCotacao.produto.brand}
                            </label>
                          </td>
                          <td className="bg-slate-900">
                            <label>{product.code}</label>
                          </td>
                          <td className="bg-slate-900">
                            <label>
                              {product.produtoDaCotacao.produto.unit}
                            </label>
                          </td>
                          <td className="bg-slate-900">
                            <div className="w-40 whitespace-normal md:w-full">
                              {product.produtoDaCotacao.produto.descricao}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
              </div>
            </div>
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
