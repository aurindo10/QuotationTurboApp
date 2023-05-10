import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RouterInputs, RouterOutputs } from "../src/utils/trpc";

type CotacaoType = {
  id: string;
  nome: string;
  ammountOfTradeRepresentative: number | null;
  empresaId: string;
};
type Store = {
  allCotacoes: CotacaoType[];
  addCotacao: (product: CotacaoType) => void;
  addManyCotacoes: (products: CotacaoType[]) => void;
  //   deleteProduct: (id: string) => void;
  //   updateProduct: (product: GetAllProducts[0]) => void;
};

export const useCotacoesStore = create(
  immer<Store>((set) => ({
    allCotacoes: [
      {
        id: "",
        nome: "",
        ammountOfTradeRepresentative: 0,
        empresaId: "",
      },
    ],
    addManyCotacoes: (cotacoes) =>
      set((state) => {
        state.allCotacoes = cotacoes;
      }),
    addCotacao: (cotacao) => {
      set((state) => {
        state.allCotacoes.push(cotacao);
      });
    },
    // addProduct: (descricao) =>
    //   set((state) => {
    //     state.allPrducts.push(descricao);
    //   }),
    // deleteProduct: (id) => {
    //   set((state) => {
    //     state.allPrducts = state.allPrducts.filter(
    //       (product) => product.id !== id,
    //     );
    //   });
    // },
    // updateProduct: (product) => {
    //   set((state) => {
    //     state.allPrducts = state.allPrducts.map((p) =>
    //       p.id === product.id ? product : p,
    //     );
    //   });
    // },
  })),
);
