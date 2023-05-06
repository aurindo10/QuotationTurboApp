import { DotsThreeOutlineVertical } from "@phosphor-icons/react";
import DropdownMenuDemo from "../molecules/DropDown";
export const CotacoesList = () => {
  return (
    <div className="flex w-full flex-col items-center ">
      <div className="card card-compact bg-base-100 w-full max-w-xl shadow-xl">
        <div className="card-body grid grid-cols-3">
          <div className="col-span-2">
            <h2 className="card-title">Cotação 01</h2>
            <h3>Enviados: 01/03</h3>
            <h3>Criado: 04/03/2023</h3>
          </div>
          <div className="card-actions justify-end">
            <DropdownMenuDemo></DropdownMenuDemo>
          </div>
        </div>
      </div>
      <div className="card card-compact bg-base-100 w-full max-w-xl shadow-xl">
        <div className="card-body grid grid-cols-3">
          <div className="col-span-2">
            <h2 className="card-title">Cotação 01</h2>
            <h3>Enviados: 01/03</h3>
            <h3>Criado: 04/03/2023</h3>
          </div>
          <div className="card-actions justify-end">
            <DropdownMenuDemo></DropdownMenuDemo>
          </div>
        </div>
      </div>
    </div>
  );
};
