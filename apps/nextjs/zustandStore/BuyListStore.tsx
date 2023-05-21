import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RouterInputs, RouterOutputs } from "../src/utils/trpc";

type BuyList =
  RouterOutputs["cotacoes"]["getCotacoesWithProductsCotadosInside"];
type Store = {
  allBuiesList: BuyList;
  addManyBuyList: (product: BuyList) => void;
  deleteBuyList: (id: string) => void;
};

export const useBuyListsStore = create(
  immer<Store>((set) => ({
    allBuiesList: [],
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
  })),
);
