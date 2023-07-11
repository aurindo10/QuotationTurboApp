import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RouterInputs, RouterOutputs } from "../src/utils/trpc";
type allProducts = RouterOutputs["cotacoes"]["getProductsFromOneCotacao"];
type produtosCotado = RouterInputs["produCotado"]["addProductCotado"] & {
  naoPossui?: boolean;
};

type Store = {
  setAllProductCotados: (
    allProducts: allProducts,
    representanteId: string,
  ) => void;
  step: number;
  setStep: (step: number) => void;
  produtoCotado: produtosCotado[];
  updateProdutoCotado: (produtoCotado: { valor: number }) => void;
  updateProdutoCotadoCode: (code: string) => void;
  updateProdutoCotadoQuantidadeMinima: (quantidadeMinima: number) => void;
  updateProdutoCotadoNaoPossui: (quantidadeMinima: boolean) => void;
};

export const usePreenchimentoStore = create(
  immer<Store>((set) => ({
    produtoCotado: [],
    setAllProductCotados: (allProducts, representanteId) => {
      const produtoCotado = allProducts
        ? allProducts.produtos.map((produto) => {
            return {
              valor: 0,
              naoPossui: true,
              cotacaoId: produto.cotacaoId,
              representanteId: representanteId,
              quantidadeMinima: 0,
              produtoDaCotacaoId: produto.id,
              code: "",
            };
          })
        : [];
      set((state) => {
        state.produtoCotado = produtoCotado;
      });
    },
    step: 1,
    setStep: (step) =>
      set((state) => {
        state.step = step;
      }),
    updateProdutoCotado: (produtoCotado) => {
      set((state) => {
        state.produtoCotado[state.step - 1]!.valor = produtoCotado.valor;
      });
    },
    updateProdutoCotadoCode: (code) => {
      set((state) => {
        state.produtoCotado[state.step - 1]!.code = code;
      });
    },
    updateProdutoCotadoQuantidadeMinima: (quantidadeMinima) => {
      set((state) => {
        state.produtoCotado[state.step - 1]!.quantidadeMinima =
          quantidadeMinima;
      });
    },
    updateProdutoCotadoNaoPossui: (possui) => {
      set((state) => {
        state.produtoCotado[state.step - 1]!.naoPossui = possui;
      });
    },
  })),
);
