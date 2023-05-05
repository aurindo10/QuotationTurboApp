import { DotsThreeOutlineVertical } from "@phosphor-icons/react";
import DropdownMenuDemo from "../molecules/DropDown";
export const CotacoesList = () => {
  return (
    <div className="flex w-full flex-col items-center ">
      <div className="card bg-base-100 w-full max-w-xl shadow-xl">
        <div className="card-body grid grid-cols-3">
          <div className="col-span-2">
            <h2 className="card-title">Cotação 01</h2>
            <h3>Enviados: 01/03</h3>
            <h3>Criado: 04/03/2023</h3>
          </div>
          <div className="card-actions justify-end">
            {/* <div className="dropdown dropdown-bottom dropdown-end">
              <label tabIndex={0}>
                <DotsThreeOutlineVertical size={28} />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-neutral rounded-box w-40 p-2 shadow"
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            </div> */}

            <DropdownMenuDemo></DropdownMenuDemo>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 w-full max-w-xl shadow-xl">
        <div className="card-body grid grid-cols-3">
          <div className="col-span-2">
            <h2 className="card-title">Cotação 01</h2>
            <h3>Enviados: 01/03</h3>
            <h3>Criado: 04/03/2023</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
