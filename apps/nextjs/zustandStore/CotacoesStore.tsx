import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RouterInputs, RouterOutputs } from "../src/utils/trpc";

type GetAllCotacoes = RouterOutputs["cotacoes"]["getCotacoes"];
type CotacaoType = {
  id: string;
  nome: string;
  ammountOfTradeRepresentative: number | null;
  empresaId: string;
};
type Store = {
  allCotacoes: GetAllCotacoes;
  addCotacao: (product: GetAllCotacoes[0]) => void;
  addManyCotacoes: (products: GetAllCotacoes) => void;
  deleteCotacao: (id: string) => void;
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
        Representante: [
          {
            cotacaoId: "",
            empresaName: "",
            createdAt: new Date(),
            empresaId: "",
            id: "",
            nome: "",
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        whoCreated: "",
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
    deleteCotacao: (id) => {
      set((state) => {
        state.allCotacoes = state.allCotacoes.filter(
          (cotacao) => cotacao.id !== id,
        );
      });
    },
    // updateProduct: (product) => {
    //   set((state) => {
    //     state.allPrducts = state.allPrducts.map((p) =>
    //       p.id === product.id ? product : p,
    //     );
    //   });
    // },
  })),
);
