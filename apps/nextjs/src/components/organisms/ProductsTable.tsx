import { PencilSimple, Trash } from "@phosphor-icons/react";

export const ProductsTabe = () => {
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
          {/* row 1 */}
          <tr>
            <th>
              <div className="w-32 whitespace-normal md:w-full">
                Carro de mão Carro de mão Carro de mão
              </div>
            </th>
            <td>
              <div className="w-40 whitespace-normal md:w-full">
                dlfl;sdkl dflkdl;f ;lsdaklds fdslkfl;sd ldkfs;lk
              </div>
            </td>
            <td>
              <label>Tramontina</label>
            </td>
            <td>
              <label>Metros</label>
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
          {/* row 2 */}
        </tbody>
        {/* foot */}
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
  );
};
