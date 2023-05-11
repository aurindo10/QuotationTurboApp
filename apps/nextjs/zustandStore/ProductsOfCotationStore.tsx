import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RouterInputs, RouterOutputs } from "../src/utils/trpc";

type getProductsByCotationType =
  RouterOutputs["product"]["getProductsByCotation"];
type getProductByNameType = RouterOutputs["product"]["getProductByName"];
type Store = {
  allProducts: getProductsByCotationType;
  searchInputState: getProductByNameType;
  addManyProducts: (product: getProductsByCotationType) => void;
  addProduct: (products: getProductsByCotationType[0]) => void;
  addProductToSearchState: (products: getProductByNameType) => void;
  //   deleteProduct: (id: string) => void;
  //   updateProduct: (product: GetAllProducts[0]) => void;
};

export const useProductsOfCotationStore = create(
  immer<Store>((set) => ({
    allProducts: [
      {
        produto: {
          id: "",
          descricao: "",
          unit: "",
          brand: "",
          nome: "",
          createdAt: null,
          updatedAt: null,
          empresaId: "",
          whoCreated: "",
        },
      },
    ],
    searchInputState: [],
    addManyProducts: (cotacoes) =>
      set((state) => {
        state.allProducts = cotacoes;
      }),
    addProduct: (cotacao) => {
      set((state) => {
        state.allProducts.push(cotacao);
      });
    },
    addProductToSearchState: (products) => {
      set((state) => {
        state.searchInputState = products;
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
