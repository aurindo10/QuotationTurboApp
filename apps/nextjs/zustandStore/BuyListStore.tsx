import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RouterInputs, RouterOutputs } from "../src/utils/trpc";

type BuyList =
  RouterOutputs["cotacoes"]["getCotacoesWithProductsCotadosInside"];
type OneBuyList = RouterOutputs["buyList"]["getBuyListByCotation"];
type OneProductBuyList = RouterOutputs["buyList"]["transferProduct"];

type Store = {
  allBuiesList: BuyList;
  allBuyListByCotation: OneBuyList;
  setAllBuyListByCotation: (buyList: OneBuyList) => void;
  addManyBuyList: (product: BuyList) => void;
  deleteBuyList: (id: string) => void;
  deleteProductFromBuyList: (id: string) => void;
  createProductOnBuyList: (product: OneProductBuyList) => void;
};

export const useBuyListsStore = create(
  immer<Store>((set) => ({
    allBuiesList: [],
    allBuyListByCotation: [],
    setAllBuyListByCotation: (buyList) => {
      set((state) => {
        state.allBuyListByCotation = buyList;
      });
    },
    addManyBuyList: (buyList) => {
      set((state) => {
        state.allBuiesList = buyList;
      });
    },
    deleteBuyList: (id) => {
      set((state) => {
        state.allBuiesList = state.allBuiesList.filter(
          (buyList) => buyList.id !== id,
        );
      });
    },
    deleteProductFromBuyList: (id) => {
      set((state) => {
        state.allBuyListByCotation = state.allBuyListByCotation.map(
          (representante) => {
            return {
              ...representante,
              buyList: representante.buyList.filter(
                (product) => product.produtoCotado.id !== id,
              ),
            };
          },
        );
      });
    },
    createProductOnBuyList: (product) => {
      set((state) => {
        const allBuyList = state.allBuyListByCotation.map((representante) => {
          if (representante.id === product.representanteId) {
            return {
              ...representante,
              buyList: [
                ...representante.buyList,
                {
                  produtoCotado: {
                    id: product.produtoCotado.id,
                    code: product.produtoCotado.code,
                    produtoDaCotacao: product.produtoCotado.produtoDaCotacao,
                    valor: product.produtoCotado.valor,
                  },
                },
              ],
            };
          } else {
            return representante;
          }
        });
        state.allBuyListByCotation = allBuyList;
      });
    },
  })),
);
