import { Buildings, User } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useBuyListsStore } from "../../../../zustandStore/BuyListStore";
import { trpc } from "../../../utils/trpc";
import { ModalToTransferProduct } from "./TransferProductModal";

export const BuyListTableBody = () => {
  const [allBuyListByCotation, setAllBuyListByCotation] = useBuyListsStore(
    (state) => [state.allBuyListByCotation, state.setAllBuyListByCotation],
  );
  function formatarParaReal(numero: number): string {
    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  const router = useRouter();
  const { data: allProductsByCotation, status } =
    trpc.buyList.getBuyListByCotation.useQuery({
      cotacaoId: router.query.id as string,
    });
  useEffect(() => {
    if (allProductsByCotation && status === "success") {
      setAllBuyListByCotation(allProductsByCotation);
    }
  }, [status, allProductsByCotation, setAllBuyListByCotation]);
  if (status === "loading") {
    return <div>loading</div>;
  }
  return (
    <div className="space-y-4 ">
      {allBuyListByCotation.map((seller) => {
        return (
          <div className="mt-6" key={seller.id}>
            {seller.buyList.length > 0 && (
              <div>
                <div className="my-2 flex items-center gap-4">
                  <div className=" flex items-center gap-2 text-[18px]">
                    <User size={32} />
                    <label>{`${seller.nome}`}</label>
                  </div>
                  <div className="flex items-center gap-2 text-[18px] ">
                    <Buildings size={32} />
                    <label>{`${seller.empresaName}`}</label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full overflow-x-auto">
                    <table className="table-zebra table w-full ">
                      {/* head */}
                      <thead>
                        <tr>
                          <th className="w-56 bg-slate-700">Nome</th>
                          <th className="w-56 bg-slate-700">Valor</th>
                          <th className="w-56 bg-slate-700">Descrição</th>
                          <th className="w-56 bg-slate-700">Marca</th>
                          <th className="w-56 bg-slate-700">Código</th>
                          <th className="w-56 bg-slate-700">Unidade</th>
                          <th className="w-56 bg-slate-700">Ações</th>
                        </tr>
                      </thead>
                      {seller.buyList.map((product) => {
                        return (
                          <tbody key={product.produtoCotado.id}>
                            <tr
                              key={product.produtoCotado.id}
                              className={"bg-slate-600"}
                            >
                              <th className={"bg-slate-600"}>
                                <div className="w-32 whitespace-normal md:w-full">
                                  {
                                    product.produtoCotado.produtoDaCotacao
                                      .produto.nome
                                  }
                                </div>
                              </th>
                              <td>
                                <label>
                                  {formatarParaReal(
                                    product.produtoCotado.valor ?? 0,
                                  )}
                                </label>
                              </td>
                              <td>
                                <div className="w-40 whitespace-normal md:w-full ">
                                  {
                                    product.produtoCotado.produtoDaCotacao
                                      .produto.descricao
                                  }
                                </div>
                              </td>
                              <td>
                                <label>
                                  {
                                    product.produtoCotado.produtoDaCotacao
                                      .produto.brand
                                  }
                                </label>
                              </td>
                              <td>
                                <label>{product.produtoCotado.code}</label>
                              </td>
                              <td>
                                <label>
                                  {
                                    product.produtoCotado.produtoDaCotacao
                                      .produto.unit
                                  }
                                </label>
                              </td>
                              <td>
                                <ModalToTransferProduct
                                  key={product.produtoCotado.id}
                                  cotacaoId={router.query.id as string}
                                  produtoDaCotacaoId={
                                    product.produtoCotado.produtoDaCotacao.id
                                  }
                                  productName={
                                    product.produtoCotado.produtoDaCotacao
                                      .produto.nome
                                  }
                                  productFromBuyListId={
                                    product.produtoCotado.id
                                  }
                                ></ModalToTransferProduct>
                              </td>
                            </tr>
                          </tbody>
                        );
                      })}
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
