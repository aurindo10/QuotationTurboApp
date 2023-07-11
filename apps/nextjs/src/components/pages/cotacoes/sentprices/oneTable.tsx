import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RouterOutputs, trpc } from "../../../../utils/trpc";

interface OneTable {
  sellerId: string;
}
type Products =
  RouterOutputs["produCotado"]["getProdutoCotadoByCotationIdAndSellerId"];
export function OneTable({ sellerId }: OneTable) {
  const router = useRouter();
  const [products, setProducts] = useState<Products>();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: numberOfProducts, status: statusNumberOfProducts } =
    trpc.produCotado.getNumberOfProdutoCotadoByCotationIdAndSellerId.useQuery({
      cotationId: router.query.id as string,
      sellerId: sellerId,
    });
  const { mutateAsync: getProductBySellerId, status } =
    trpc.produCotado.getProdutoCotadoByCotationIdAndSellerId.useMutation();
  const productsPerPage = 12;
  const numberOfPaginations = Math.ceil(
    (numberOfProducts ?? 0) / productsPerPage,
  );
  useEffect(() => {
    const handleGetProductBySellerId = async () => {
      const data = await getProductBySellerId({
        cotationId: router.query.id as string,
        sellerId: sellerId,
        skip: (currentPage - 1) * productsPerPage,
        take: productsPerPage,
      });
      return data;
    };
    handleGetProductBySellerId()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        alert(err);
      });
  }, [currentPage]);
  return (
    <div>
      {statusNumberOfProducts === "loading" && status === "loading" ? (
        <div className="text-slate-50">Carregando...</div>
      ) : (
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
              {products?.map((product) => {
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
                        <label>{formatarParaReal(product.valor ?? 0)}</label>
                      </td>

                      <td className="bg-slate-900">
                        <label>{product.produtoDaCotacao.produto.brand}</label>
                      </td>
                      <td className="bg-slate-900">
                        <label>{product.code}</label>
                      </td>
                      <td className="bg-slate-900">
                        <label>{product.produtoDaCotacao.produto.unit}</label>
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
          <div className="join flex justify-end">
            {Array.from(Array(numberOfPaginations), (item, index) => {
              return (
                <button
                  className="join-item btn btn-square btn-sm"
                  name="options"
                  aria-label="4"
                  key={index}
                  onClick={() => {
                    setCurrentPage(index + 1);
                  }}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
