import { PencilSimple, Trash } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

export const SentPricesBody = () => {
  const router = useRouter();
  const { data, status } =
    trpc.produCotado.getListOfPricesByCotationId.useQuery({
      cotacaoId: router.query.id as string,
    });
  if (status === "loading") {
    return <div className="">loading</div>;
  }
  return (
    <div className="py-4 px-2 ">
      <div className="space-y-2">
        {data?.map((seller) => {
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
                      </tr>
                    </thead>
                    {seller.produtoCotado.map((product) => {
                      return (
                        <tbody>
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
                              <label>{product.valor}</label>
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
