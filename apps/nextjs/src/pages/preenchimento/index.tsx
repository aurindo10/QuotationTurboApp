import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { usePreenchimentoStore } from "../../../zustandStore/PreenchimentoStore";
import { trpc } from "../../utils/trpc";

export default function Page() {
  const router = useRouter();
  const representanteInfo = router.query;
  const [setAllProductCotados, step, setStep] = usePreenchimentoStore(
    (state) => [state.setAllProductCotados, state.step, state.setStep],
  );

  const { data: oneCotacao, status } =
    trpc.cotacoes.getProductsFromOneCotacao.useQuery({
      idCotacao: representanteInfo.idCotacao as string,
    });
  const lengthOfProducts =
    oneCotacao?.produtos.length === undefined ? 0 : oneCotacao.produtos.length;
  useEffect(() => {
    if (oneCotacao) {
      setAllProductCotados(oneCotacao);
    }
  }, [oneCotacao, status]);
  if (status === "loading") return <div>loading</div>;
  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="produto text-white">Produto:</div>
        <div className="">{oneCotacao?.produtos[step - 1]?.produto.nome}</div>
        <div className="">{`${oneCotacao?.produtos[step - 1]?.quantidade}  ${
          oneCotacao?.produtos[step]?.produto.unit
        }`}</div>
        <div className="">
          {oneCotacao?.produtos[step - 1]?.produto.brand}
          <span> </span>
        </div>
      </div>
      <form className="flex w-full flex-col items-center">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Valor do produto</span>
          </label>
          <input
            type="number"
            placeholder="R$ 0,00"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Quantidade mínima</span>
          </label>
          <input
            type="number"
            placeholder="0 unidades"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Código</span>
          </label>
          <input
            type="text"
            placeholder="00000"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
      </form>
      <div className="buttons my-4 flex justify-around">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            if (step > 1) setStep(step - 1);
          }}
        >
          Anterior
        </button>
        <span>{`${step}/${lengthOfProducts}`}</span>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            if (step < lengthOfProducts!) setStep(step + 1);
          }}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
