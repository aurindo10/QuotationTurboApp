import { PencilSimple, Trash } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

export const BuyListTableBody = () => {
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
          <div>
            <div className="card card-compact bg-base-100 w-full max-w-xl shadow-xl">
              {seller.nome}
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
                      <th className="w-8 text-center">Ações</th>
                    </tr>
                  </thead>
                  {seller.buyList.map((product) => {
                    return (
                      <tbody>
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
                            <label>
                              {
                                product.produtoCotado.produtoDaCotacao.produto
                                  .unit
                              }
                            </label>
                          </td>
                          <td>
                            <label>{product.produtoCotado.valor}</label>
                          </td>
                          <th className="space-x-3">
                            <button className="btn btn-accent  btn-square">
                              <Trash size={24} />
                            </button>
                            <button className="btn btn-warning  btn-square">
                              <PencilSimple size={24} />
                            </button>
                          </th>
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
