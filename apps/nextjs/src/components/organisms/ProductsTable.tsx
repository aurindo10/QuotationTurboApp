import { PencilSimple, Trash } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useProductsStore } from "../../../zustandStore/ProductStore";
import { trpc } from "../../utils/trpc";
import { ProductsTableSkeleton } from "../SkeletonPages/ProductPageSkeleton";

export const ProductsTabe = () => {
  const { data, status } = trpc.product.getAllProducts.useQuery();
  const [allPrducts, addManyProducts] = useProductsStore((state) => [
    state.allPrducts,
    state.addManyProducts,
  ]);
  useEffect(() => {
    if (status === "success") {
      addManyProducts(data);
    }
  }, [data, status]);
  return (
    <div>
      {status === "loading" ? (
        <ProductsTableSkeleton />
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="table-zebra table w-full ">
            {/* head */}
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Marca</th>
                <th>Unidade</th>
                <th className="w-8 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {allPrducts?.map((product) => {
                return (
                  <tr key={product.id}>
                    <th>
                      <div className="w-32 whitespace-normal md:w-full">
                        {product.nome}
                      </div>
                    </th>
                    <td>
                      <div className="w-40 whitespace-normal md:w-full">
                        {product.descricao}
                      </div>
                    </td>
                    <td>
                      <label>{product.brand}</label>
                    </td>
                    <td>
                      <label>{product.unit}</label>
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
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Marca</th>
                <th>Unidade</th>
                <th className="w-8 text-center">Ações</th>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
