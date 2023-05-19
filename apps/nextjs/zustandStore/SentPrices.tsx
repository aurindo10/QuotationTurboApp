import React, { useEffect } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RouterOutputs } from "../src/utils/trpc";

type SentPricesStore =
  RouterOutputs["produCotado"]["getListOfPricesByCotationId"];

type Store = {
  sentPrices: SentPricesStore;
  setSentPrices: (sentPrices: SentPricesStore) => void;
  deleteSentPrices: (id: string) => void;
};

export const useSentPricesStore = create(
  immer<Store>((set, get) => ({
    sentPrices: [],
    setSentPrices: (sentPrices) => {
      set((state) => {
        state.sentPrices = sentPrices;
      });
    },
    deleteSentPrices: (id) => {
      set((state) => {
        state.sentPrices = state.sentPrices.filter(
          (sentPrice) => sentPrice.id !== id,
        );
      });
    },
  })),
);
