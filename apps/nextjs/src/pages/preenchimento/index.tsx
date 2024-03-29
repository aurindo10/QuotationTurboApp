import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { usePreenchimentoStore } from "../../../zustandStore/PreenchimentoStore";
import { PreenchimentoPage } from "../../components/preenchimento/HeaderPreenchimentoPage";
import { RouterOutputs, trpc } from "../../utils/trpc";

const FormSchema = z.object({
  valor: z.number().min(0),
  code: z.string().min(0),
  quantidadeMinima: z.number().min(0),
});
type FormData = z.infer<typeof FormSchema>;
type OneCotacao = RouterOutputs["cotacoes"]["getProductsFromOneCotacao"];
export default function Page() {
  const [loading, setLoading] = useState("");
  const { mutateAsync: sendProposta } =
    trpc.produCotado.addManyProductsCotados.useMutation();
  const [valor, setValor] = useState(0);
  const [valorDisplay, setValorDisplay] = useState("");

  const transformToReal = (value: number) => {
    console.log(value);
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
    console.log(formatted);
    setValorDisplay(formatted);
    setValor(value);
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    const onlyNums = input.replace(/[^0-9]/g, "");
    const parsedNum = parseFloat(onlyNums) / 100;

    if (!isNaN(parsedNum)) {
      if (parsedNum > 0) {
        updateProdutoCotadoNaoPossui(true);
      }
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(parsedNum);
      setValorDisplay(formatted);
      updateProdutoCotado({
        valor: parsedNum,
      });
      setValor(parsedNum);
    }
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
    updateProdutoCotadoCode,
    updateProdutoCotadoQuantidadeMinima,
    updateProdutoCotadoNaoPossui,
  ] = usePreenchimentoStore((state) => [
    state.setAllProductCotados,
    state.step,
    state.setStep,
    state.produtoCotado,
    state.updateProdutoCotado,
    state.produtoCotado,
    state.updateProdutoCotadoCode,
    state.updateProdutoCotadoQuantidadeMinima,
    state.updateProdutoCotadoNaoPossui,
  ]);
  const { mutateAsync: getOneCotacao, status } =
    trpc.cotacoes.getProductsFromOneCotacao.useMutation({});
  const [lengthOfProducts, setLengthOfProducts] = useState(0);
  const [localStep, setLocalStep] = useState(step);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      valor: 0,
      code: "",
      quantidadeMinima: 0,
    },
  });
  const [oneCotacao, setOneCotacao] = useState<OneCotacao>(null);
  useEffect(() => {
    const oneCotacaoFromDb = async () => {
      await getOneCotacao({
        idCotacao: representanteInfo.idCotacao as string,
      })
        .then((res) => {
          setLengthOfProducts(res?.produtos.length ?? 0);
          setOneCotacao(res);
          if (!allProductsCotados[step]) {
            setAllProductCotados(
              res,
              representanteInfo.idRepresentante as string,
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return { message: "ok" };
    };
    oneCotacaoFromDb();
  }, []);

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
  }, [step, localStep]);
  useEffect(() => {
    setLocalStep(step);
  }, [step]);
  const HandleNext = () => {
    if (localStep < lengthOfProducts) setStep(localStep + 1);
  };
  const HandleBack = () => {
    if (localStep > 1) setStep(localStep - 1);
  };

  if (status === "loading") return <div>loading</div>;
  const handleSendProposta = async () => {
    setLoading("loading");
    const res = await sendProposta({
      products: allProductsCotados,
    });
    if (res) {
      router.replace({
        pathname: `/preenchimento/confirmacao`,
        query: {
          enviado: true,
        },
      });
    }
  };
  return (
    <form className="w-full">
      <div className="w-full">
        <PreenchimentoPage
          oneCotacao={oneCotacao!}
          localStep={localStep}
        ></PreenchimentoPage>
      </div>

      <div className="flex w-full flex-col items-center">
        <div className="form-control">
          <label className="label cursor-pointer gap-1 ">
            <span className="label-text text-red-500">Não tenho este item</span>
            <input
              type="checkbox"
              className="toggle"
              checked={!allProductsCotados[step - 1]?.naoPossui}
              onChange={(e) => {
                updateProdutoCotadoNaoPossui(!e.target.checked);
              }}
            />
          </label>
        </div>
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
                min={0}
                onChange={(e) => {
                  if (e.target.value === "") return field.onChange("");
                  field.onChange(parseInt(e.target.value));
                  updateProdutoCotadoQuantidadeMinima(parseInt(e.target.value));
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
                onChange={(e) => {
                  field.onChange(e.target.value);
                  updateProdutoCotadoCode(e.target.value);
                }}
                type="text"
                placeholder="00000"
                className="input input-bordered w-full max-w-xs"
              />
            )}
          />
        </div>
      </div>

      <div className="flex w-full justify-center">
        <div className="w-full max-w-xs">
          {valor <= 0 && allProductsCotados[step - 1]?.naoPossui && (
            <div className="text-center text-[12px] text-red-500">
              Para clicar em próximo preencha o valor do produto ou marque a
              opção acima como "Não tenho este item"
            </div>
          )}

          <div className="buttons my-4 flex w-full max-w-xs justify-between">
            <button
              className="btn btn-error btn-sm"
              disabled={localStep === 1 || loading === "loading" ? true : false}
              onClick={(e) => {
                if (loading === "") {
                  e.preventDefault();
                  HandleBack();
                }
              }}
            >
              Anterior
            </button>

            <span>{`${localStep}/${lengthOfProducts}`}</span>
            <button
              className={`btn btn-error btn-sm `}
              disabled={
                localStep === lengthOfProducts ||
                loading === "loading" ||
                (valor <= 0 && allProductsCotados[step - 1]?.naoPossui)
              }
              onClick={(e) => {
                if (loading === "") {
                  e.preventDefault();
                  HandleNext();
                }
              }}
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center">
        {localStep === lengthOfProducts ? (
          <button
            onClick={(e) => {
              if (loading === "") {
                e.preventDefault();
                handleSendProposta();
              }
            }}
            className={`btn btn-primary  ${loading} ${
              loading === "loading" ? "cursor-not-allowed" : ""
            } `}
            disabled={valor <= 0 && allProductsCotados[step - 1]?.naoPossui}
          >
            Enviar orçamento
          </button>
        ) : (
          ""
        )}
      </div>
    </form>
  );
}
