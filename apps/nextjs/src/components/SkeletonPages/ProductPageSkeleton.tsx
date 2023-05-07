import { Skeleton } from "../atoms/Skeleton";

export const ProductsTableSkeleton = () => {
  return (
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
          {Array.from({ length: 5 }).map((_, index) => {
            return (
              <tr key={index}>
                <th>
                  <Skeleton className="h-4 w-32 md:w-full" />
                </th>
                <td>
                  <Skeleton className="h-4 w-40  md:w-full" />
                </td>
                <td>
                  <Skeleton className="h-4 w-14" />
                </td>
                <td>
                  <Skeleton className="h-4 w-14" />
                </td>
                <th className="flex space-x-3">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
