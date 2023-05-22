import { PencilSimple, Trash } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

export const BuyListTableBody = () => {
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
  if (status === "loading") {
    return <div>loading</div>;
  }
  return (
    <div className="space-y-2">
      {allProductsByCotation?.map((seller) => {
        return (
          <div key={seller.id}>
            <div className="flex justify-start gap-6 py-4 px-2">
              <label>{`Vendedor: ${seller.nome}`}</label>
              <label>{` Empresa: ${seller.empresaName}`}</label>
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
                      <th className="w-56">Código</th>
                      <th className="w-56">Unidade</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  {seller.buyList.map((product) => {
                    return (
                      <tbody key={product.produtoCotado.id}>
                        <tr key={product.produtoCotado.id}>
                          <th>
                            <div className="w-32 whitespace-normal md:w-full">
                              {
                                product.produtoCotado.produtoDaCotacao.produto
                                  .nome
                              }
                            </div>
                          </th>
                          <td>
                            <div className="w-40 whitespace-normal md:w-full">
                              {
                                product.produtoCotado.produtoDaCotacao.produto
                                  .descricao
                              }
                            </div>
                          </td>
                          <td>
                            <label>
                              {
                                product.produtoCotado.produtoDaCotacao.produto
                                  .brand
                              }
                            </label>
                          </td>
                          <td>
                            <label>{product.produtoCotado.code}</label>
                          </td>
                          <td>
                            <label>
                              {
                                product.produtoCotado.produtoDaCotacao.produto
                                  .unit
                              }
                            </label>
                          </td>
                          <td>
                            <label>
                              {formatarParaReal(
                                product.produtoCotado.valor ?? 0,
                              )}
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
  );
};
