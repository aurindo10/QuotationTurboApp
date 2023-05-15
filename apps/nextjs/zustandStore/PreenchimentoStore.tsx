import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RouterInputs, RouterOutputs } from "../src/utils/trpc";
type allProducts = RouterOutputs["cotacoes"]["getProductsFromOneCotacao"];
type produtosCotado = RouterInputs["produCotado"]["addProductCotado"];

type Store = {
  setAllProductCotados: (allProducts: allProducts) => void;
  step: number;
  setStep: (step: number) => void;
  produtoCotado: produtosCotado[];
  updateProdutoCotado: (produtoCotado: produtosCotado) => void;
};

export const usePreenchimentoStore = create(
  immer<Store>((set) => ({
    produtoCotado: [],
    setAllProductCotados: (allProducts) => {
      const produtoCotado = allProducts
        ? allProducts.produtos.map((produto) => {
            return {
              valor: 0,
              cotacaoId: produto.cotacaoId,
              representanteId: "",
              quantidadeMinima: 0,
              produtoDaCotacaoId: allProducts.id,
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
        state.produtoCotado[state.step] = produtoCotado;
      });
    },
  })),
);
