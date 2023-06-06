import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RouterOutputs } from "../src/utils/trpc";

type Store = {
  title: string;
  setTitle: (title: string) => void;
};

export const usePageStore = create(
  immer<Store>((set, get) => ({
    title: "",
    setTitle: (title) => {
      set((state) => {
        state.title = title;
      });
    },
  })),
);
