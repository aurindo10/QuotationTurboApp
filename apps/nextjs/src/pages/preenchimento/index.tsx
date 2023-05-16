import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { usePreenchimentoStore } from "../../../zustandStore/PreenchimentoStore";
import { trpc } from "../../utils/trpc";

const FormSchema = z.object({
  valor: z.number().min(0),
  code: z.string().min(0),
  quantidadeMinima: z.number().min(0),
});
type FormData = z.infer<typeof FormSchema>;
export default function Page() {
  const [valor, setValor] = useState(0);
  const [valorDisplay, setValorDisplay] = useState("");

  const transformToReal = (value: number) => {
    const onlyNums = value.toString().replace(/[^0-9]/g, "");
    const floatNum = parseFloat((parseInt(onlyNums) / 100).toString()).toFixed(
      2,
    );
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(floatNum));
    setValorDisplay(formatted);
    setValor(parseFloat(floatNum));
  };
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, "");
    const floatNum = parseFloat((parseInt(onlyNums) / 100).toString()).toFixed(
      2,
    );
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(floatNum));
    setValorDisplay(formatted);
    setValor(parseFloat(floatNum)); // Convert floatNum to a number before setting the state.
  };

  const router = useRouter();
  const representanteInfo = router.query;
  const [
    setAllProductCotados,
    step,
    setStep,
    allProductsCotados,
    updateProdutoCotado,
    produtoCotado,
  ] = usePreenchimentoStore((state) => [
    state.setAllProductCotados,
    state.step,
    state.setStep,
    state.produtoCotado,
    state.updateProdutoCotado,
    state.produtoCotado,
  ]);
  const [navigateToNextStep, setNavigateToNextStep] = useState(true);
  const { data: oneCotacao, status } =
    trpc.cotacoes.getProductsFromOneCotacao.useQuery({
      idCotacao: representanteInfo.idCotacao as string,
    });
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      valor: 0,
      code: "",
      quantidadeMinima: 0,
    },
  });
  const lengthOfProducts =
    oneCotacao?.produtos.length === undefined ? 0 : oneCotacao.produtos.length;
  useEffect(() => {
    if (oneCotacao) {
      if (!allProductsCotados[step]) {
        setAllProductCotados(oneCotacao);
      }
    }
  }, [oneCotacao, status]);
  const [localStep, setLocalStep] = useState(step);

  useEffect(() => {
    if (allProductsCotados[step - 1]) {
      setValue("valor", allProductsCotados[step - 1]!.valor ?? 0);
      transformToReal(allProductsCotados[step - 1]!.valor ?? 0);
      setValue(
        "quantidadeMinima",
        allProductsCotados[step - 1]!.quantidadeMinima ?? 0,
      );
      setValue("code", allProductsCotados[step - 1]!.code ?? "");
    }
  }, [allProductsCotados, step, allProductsCotados[step]?.valor, localStep]);
  useEffect(() => {
    setLocalStep(step);
  }, [step]);
  const onSubmit = async (data: FormData) => {
    updateProdutoCotado({
      ...data,
      valor: valor,
    });

    if (navigateToNextStep) {
      if (localStep < lengthOfProducts) setStep(localStep + 1);
    }
    if (!navigateToNextStep) {
      if (localStep > 1) setStep(localStep - 1);
    }
  };

  if (status === "loading") return <div>loading</div>;
  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="produto text-white">Produto:</div>
        <div className="">
          {oneCotacao?.produtos[localStep - 1]?.produto.nome}
        </div>
        <div className="">{`${
          oneCotacao?.produtos[localStep - 1]?.quantidade
        }  ${oneCotacao?.produtos[localStep - 1]?.produto.unit}`}</div>
        <div className="">
          {oneCotacao?.produtos[localStep - 1]?.produto.brand}
          <span> </span>
        </div>
      </div>
      <div className="flex w-full flex-col items-center">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Valor do produto</span>
          </label>
          <Controller
            name="valor"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                value={valorDisplay}
                onChange={handleValorChange}
                type="text"
                placeholder="R$ 0,00"
                className="input input-bordered w-full max-w-xs"
              />
            )}
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Quantidade mínima</span>
          </label>
          <Controller
            name="quantidadeMinima"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <input
                {...field}
                onChange={(e) => {
                  if (e.target.value === "") return field.onChange("");
                  field.onChange(parseInt(e.target.value));
                }}
                type="number"
                placeholder="0 unidades"
                className="input input-bordered w-full max-w-xs"
              />
            )}
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Código</span>
          </label>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="00000"
                className="input input-bordered w-full max-w-xs"
              />
            )}
          />
        </div>
      </div>
      <div className="buttons my-4 flex justify-around">
        <button
          className="btn btn-primary btn-sm"
          type="submit"
          disabled={localStep === 1 ? true : false}
          onClick={(e) => {
            setNavigateToNextStep(false);
          }}
        >
          Anterior
        </button>

        <span>{`${localStep}/${lengthOfProducts}`}</span>
        <button
          className={`btn btn-primary btn-sm `}
          type="submit"
          disabled={localStep === lengthOfProducts ? true : false}
          onClick={(e) => {
            setNavigateToNextStep(true);
          }}
        >
          Próximo
        </button>
      </div>
    </form>
  );
}
