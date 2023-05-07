import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RouterOutputs } from "../src/utils/trpc";

type GetAllProducts = RouterOutputs["product"]["getAllProducts"];

type Store = {
  allPrducts: GetAllProducts;
  addProduct: (product: GetAllProducts[0]) => void;
  addManyProducts: (products: GetAllProducts) => void;
  deleteProduct: (id: string) => void;
};

export const useProductsStore = create(
  immer<Store>((set) => ({
    allPrducts: [],
    addManyProducts: (products) =>
      set((state) => {
        state.allPrducts = products;
      }),
    addProduct: (descricao) =>
      set((state) => {
        state.allPrducts.push(descricao);
      }),
    deleteProduct: (id) => {
      set((state) => {
        state.allPrducts = state.allPrducts.filter(
          (product) => product.id !== id,
        );
      });
    },
  })),
);
