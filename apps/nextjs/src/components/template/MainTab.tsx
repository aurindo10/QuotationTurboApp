import * as Tabs from "@radix-ui/react-tabs";
import { ProductsTableCotation } from "../pages/cotacoes/sentprices/ProductsFromCotation";
import { SentPricesBody } from "../pages/cotacoes/sentprices/SentPricesBody";
import { SubHeaderProductsCotacao } from "../pages/cotacoes/RegisteredProducts/SubHeaderProductsCotacao";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import React from "react";

export function MainTab() {
  const { mutateAsync: compareProductsCotados } =
    trpc.buyList.compareProductsCotados.useMutation();
  const [isLoading, setIsLoading] = React.useState("");
  const router = useRouter();
  const HandleCompareProductsCotados = async () => {
    try {
      setIsLoading("loading");
      console.log(router.query.id as string);
      const comparedProducts = await compareProductsCotados({
        cotacaoId: router.query.id as string,
      });
      router.push(`/buylist/products/${router.query.id as string}`);
      setIsLoading("");
      alert("Lista de compras gerada com sucesso");
    } catch ({ message }) {
      setIsLoading("");
      alert(message);
    }
  };
  return (
    <div className="flex w-full justify-center">
      <Tabs.Root
        defaultValue="tab1"
        className="shadow-blackA4 flex w-full max-w-[900px] flex-col shadow-[0_2px_10px]"
      >
        <Tabs.List
          className="border-mauve6 flex shrink-0 border-b"
          aria-label="Manage your account"
        >
          <Tabs.Trigger
            className="data-[state=active]:focus:slate-50 flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-slate-800 px-5 text-[15px] leading-none text-slate-500 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-slate-50 data-[state=active]:text-slate-50 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px]"
            value="tab1"
          >
            Produtos Cadastrados
          </Tabs.Trigger>
          <Tabs.Trigger
            className="flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-slate-800 px-5 text-[15px] leading-none text-slate-500 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-slate-50 data-[state=active]:text-slate-50 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-slate-50"
            value="tab2"
          >
            Cotações Enviadas
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          className="grow rounded-b-md bg-slate-800 p-3 outline-none focus:shadow-[0_0_0_2px] focus:shadow-slate-50 md:p-5"
          value="tab1"
        >
          <div className="w-full space-y-2">
            <SubHeaderProductsCotacao></SubHeaderProductsCotacao>
            <div className="flex w-full justify-center">
              <div className="w-full max-w-4xl">
                <ProductsTableCotation></ProductsTableCotation>
              </div>
            </div>
          </div>
        </Tabs.Content>
        <Tabs.Content
          className="grow rounded-b-md bg-slate-800 p-3 outline-none focus:shadow-[0_0_0_2px] focus:shadow-slate-50 md:p-5"
          value="tab2"
        >
          <div className="flex w-full justify-end">
            <button
              className={`btn btn-warning ${isLoading}`}
              onClick={HandleCompareProductsCotados}
            >
              Comparar estes preços
            </button>
          </div>
          <SentPricesBody></SentPricesBody>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
