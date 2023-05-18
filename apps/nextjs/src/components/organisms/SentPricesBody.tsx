import { PencilSimple, Trash } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useRouter as pastUseRouter } from "next/router";

import { trpc } from "../../utils/trpc";

export const SentPricesBody = () => {
  const router = useRouter();
  const pastRouter = pastUseRouter();
  const { mutateAsync: deleteProdutosCotados } =
    trpc.produCotado.deleteProdutosCotados.useMutation();
  const HandledeleteProdutosCotados = async (id: string) => {
    const deletedProdutosCotados = await deleteProdutosCotados({
      representanteId: id,
    });
    if (deletedProdutosCotados) {
    }
  };
  const { data, status } =
    trpc.produCotado.getListOfPricesByCotationId.useQuery({
      cotacaoId: pastRouter.query.id as string,
    });
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
    <div className="py-4 px-2 ">
      <div className="space-y-4">
        {data?.map((seller) => {
          return (
            <div key={seller.id}>
              <div className="flex items-center gap-4">
                <div className="badge badge-accent text-[18px]">
                  {`${seller.nome}`}
                </div>
                <div className="badge badge-accent text-[18px]">
                  {`${seller.empresaName}`}
                </div>
                <button
                  onClick={() => {
                    HandledeleteProdutosCotados(seller.id);
                  }}
                  className="btn btn-square btn-accent btn-sm"
                >
                  <Trash></Trash>
                </button>
              </div>
              <div className="space-y-2">
                <div className="w-full overflow-x-auto">
                  <table className="table-zebra table w-full ">
                    {/* head */}
                    <thead>
                      <tr>
                        <th className="w-56">Nome</th>
                        <th className="w-56">Descrição</th>
                        <th className="w-56">Marca</th>
                        <th className="w-56">Unidade</th>
                        <th>Valor</th>
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
                            <th>
                              <div className="w-32 whitespace-normal md:w-full">
                                {product.produtoDaCotacao.produto.nome}
                              </div>
                            </th>
                            <td>
                              <div className="w-40 whitespace-normal md:w-full">
                                {product.produtoDaCotacao.produto.descricao}
                              </div>
                            </td>
                            <td>
                              <label>
                                {product.produtoDaCotacao.produto.brand}
                              </label>
                            </td>
                            <td>
                              <label>
                                {product.produtoDaCotacao.produto.unit}
                              </label>
                            </td>
                            <td>
                              <label>
                                {formatarParaReal(product.valor ?? 0)}
                              </label>
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
      </div>
    </div>
  );
};
