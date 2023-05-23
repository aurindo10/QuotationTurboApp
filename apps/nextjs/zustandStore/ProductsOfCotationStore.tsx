import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RouterInputs, RouterOutputs } from "../src/utils/trpc";

type getProductsByCotationType =
  RouterOutputs["product"]["getProductsByCotation"];
type getProductByNameType = RouterOutputs["product"]["getProductByName"];
type Store = {
  allProducts: getProductsByCotationType;
  productName: string;
  setProductName: (name: string) => void;
  searchInputState: getProductByNameType;
  addManyProducts: (product: getProductsByCotationType) => void;
  addProduct: (products: getProductsByCotationType[0]) => void;
  addProductToSearchState: (products: getProductByNameType) => void;
  setIsLoading: (sate: string) => void;
  isLoading: string;
  selectedProductId: string;
  setSelectedProductId: (productId: string) => void;
  selectedProduct: getProductByNameType[0];
  setSelectedProduct: () => void;
  deleteProduct: (id: string) => void;
  resetSelectedProduct: () => void;
};

export const useProductsOfCotationStore = create(
  immer<Store>((set, get) => ({
    allProducts: [
      {
        id: "",
        produto: {
          id: "",
          descricao: "",
          unit: "",
          brand: "",
          nome: "",
          createdAt: null,
          updatedAt: null,
          clerkIdOrg: "",
          whoCreated: "",
          code: "",
        },
      },
    ],
    productName: "",
    setProductName: (name) => {
      set((state) => {
        state.productName = name;
      });
    },
    selectedProduct: {
      id: "",
      descricao: "",
      unit: "",
      brand: "",
      nome: "",
      createdAt: null,
      updatedAt: null,
      whoCreated: "",
      code: "",
      clerkIdOrg: "",
    },
    searchInputState: [],
    isLoading: "",
    selectedProductId: "",
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
    setIsLoading: (loading) => {
      set((state) => {
        state.isLoading = loading;
      });
    },
    setSelectedProductId: (product) => {
      set((state) => {
        state.selectedProductId = product;
      });
    },
    setSelectedProduct: () => {
      const currentState = get();
      const foundProduct = currentState.searchInputState.find(
        (product) => product.id === currentState.selectedProductId,
      );
      set((state) => {
        if (foundProduct) {
          state.selectedProduct = foundProduct;
        } else {
          state.selectedProduct = {
            id: "",
            descricao: "",
            unit: "",
            brand: "",
            nome: "",
            createdAt: null,
            updatedAt: null,
            clerkIdOrg: "",
            whoCreated: "",
            code: "",
          };
        }
      });
    },
    deleteProduct: (id) => {
      set((state) => {
        state.allProducts = state.allProducts.filter(
          (product) => product.id != id,
        );
      });
    },
    resetSelectedProduct: () => {
      set((state) => {
        state.selectedProduct = {
          id: "",
          descricao: "",
          unit: "",
          brand: "",
          nome: "",
          createdAt: null,
          updatedAt: null,
          clerkIdOrg: "",
          whoCreated: "",
          code: "",
        };
      });
    },
  })),
);
