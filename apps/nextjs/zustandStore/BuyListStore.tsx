import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RouterInputs, RouterOutputs } from "../src/utils/trpc";

type BuyList =
  RouterOutputs["cotacoes"]["getCotacoesWithProductsCotadosInside"];
type Store = {
  allBuiesList: BuyList;
  addManyBuyList: (product: BuyList) => void;
  //   deleteCotacao: (id: string) => void;
  //   deleteProduct: (id: string) => void;
  //   updateProduct: (product: GetAllProducts[0]) => void;
};

export const useBuyListsStore = create(
  immer<Store>((set) => ({
    allBuiesList: [],
    addManyBuyList: (buyList) => {
      set((state) => {
        state.allBuiesList = buyList;
      });
    },
  })),
);
