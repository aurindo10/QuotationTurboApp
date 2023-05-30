import { ArrowClockwise, Plus, Trash } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { useBuyListsStore } from "../../../zustandStore/BuyListStore";
import { trpc } from "../../utils/trpc";
interface InfoModal {
  cotacaoId: string;
  produtoDaCotacaoId: string;
  productName: string;
  productFromBuyListId: string;
}
export const ModalToTransferProduct = ({
  cotacaoId,
  productName,
  produtoDaCotacaoId,
  productFromBuyListId,
}: InfoModal) => {
  const [
    allBuyListByCotation,
    setAllBuyListByCotation,
    deleteProductFromBuyList,
    createProductOnBuyList,
  ] = useBuyListsStore((state) => [
    state.allBuyListByCotation,
    state.setAllBuyListByCotation,
    state.deleteProductFromBuyList,
    state.createProductOnBuyList,
  ]);
  const [isLoading, setIsLoading] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const { data: allProductsByRepresentante, status } =
    trpc.buyList.getPriceOfProductCotadoByProduct.useQuery({
      cotacaoId: cotacaoId,
      produtoDaCotacaoId: produtoDaCotacaoId,
    });

  const { mutateAsync: transferProduct } =
    trpc.buyList.transferProduct.useMutation();

  const handleTransferProduct = async (
    cotacaoId: string,
    idProdutoCotadoToCreateProductFromBuyList: string,
    representanteId: string,
    productFromBuyListId: string,
  ) => {
    setIsLoading("loading");
    const productCreatedOnBuyList = await transferProduct({
      cotacaoId,
      idProdutoCotadoToCreateProductFromBuyList,
      representanteId,
      productFromBuyListId,
    });
    deleteProductFromBuyList(productFromBuyListId);
    createProductOnBuyList(productCreatedOnBuyList);
    return status;
  };

  if (status === "loading") {
    return <div className="text-[18px] text-slate-50">Carregando...</div>;
  }
  return (
    <Dialog.Root open={open} onOpenChange={() => setOpen(!open)}>
      <div>
        <button onClick={() => setOpen(true)} className="btn btn-warning">
          Transferir
        </button>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-50" />
        <Dialog.Content
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="data-[state=open]:animate-contentShow bg-neutral fixed top-[50%] left-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[10px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
        >
          <div className="w-full overflow-x-auto">
            <table className="table-zebra table w-full">
              <thead>
                <tr>
                  <th>Representante</th>
                  <th>Valor</th>
                  <th>Ação</th>
                </tr>
              </thead>
              {allProductsByRepresentante?.map((representante) => {
                function formatarParaReal(numero: number): string {
                  return numero.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  });
                }
                return (
                  <tbody key={representante.id}>
                    {productFromBuyListId ===
                    representante.produtoCotado.find(
                      (produtoCotado) =>
                        produtoCotado.produtoDaCotacaoId === produtoDaCotacaoId,
                    )?.id ? (
                      ""
                    ) : (
                      <tr key={representante.id}>
                        <th className="w-32 whitespace-normal">
                          {representante.nome}
                        </th>
                        <td>
                          {formatarParaReal(
                            representante.produtoCotado.find(
                              (produtoCotado) =>
                                produtoCotado.produtoDaCotacaoId ===
                                produtoDaCotacaoId,
                            )?.valor ?? 0,
                          )}
                        </td>
                        <td>
                          <button
                            className={`btn btn-xs btn-warning`}
                            onClick={() => {
                              handleTransferProduct(
                                cotacaoId,
                                representante.produtoCotado.find(
                                  (produtoCotado) =>
                                    produtoCotado.produtoDaCotacaoId ===
                                    produtoDaCotacaoId,
                                )?.id ?? "",
                                representante.id,
                                productFromBuyListId,
                              );
                            }}
                          >
                            Mudar
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                );
              })}
              <div
                className={`btn btn-square ${isLoading}  ${
                  isLoading ? "" : "hidden"
                }`}
              ></div>
            </table>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
