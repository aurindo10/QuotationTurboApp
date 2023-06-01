import { RouterOutputs } from "../../utils/trpc";

type AllProductsFromOneCotation =
  RouterOutputs["cotacoes"]["getProductsFromOneCotacao"];
interface HeaderPreenchimentoPageProps {
  oneCotacao: AllProductsFromOneCotation;
  localStep: number;
}
export const PreenchimentoPage = ({
  oneCotacao,
  localStep,
}: HeaderPreenchimentoPageProps) => {
  return (
    <div className="py-2">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="produto text-[25px] font-bold ">Produto:</div>
        <div className="text-[30px] font-bold text-white">
          {oneCotacao?.produtos[localStep - 1]?.produto.nome}
        </div>
        <div className="flex gap-1 text-[25px]">
          <label>{oneCotacao?.produtos[localStep - 1]?.quantidade} </label>
          <label>{oneCotacao?.produtos[localStep - 1]?.produto.unit}</label>
        </div>
        <div className="flex gap-2 text-[20px]">
          <label>Marca:</label>
          <label className="text-white">
            {oneCotacao?.produtos[localStep - 1]?.produto.brand}
          </label>
          <span> </span>
        </div>
        <div>
          <label className="flex gap-2">
            <label className="text-[20px]">Código:</label>
            <label className="text-[20px] text-white">
              {oneCotacao?.produtos[localStep - 1]?.produto.code}
            </label>
          </label>
        </div>
      </div>
    </div>
  );
};
