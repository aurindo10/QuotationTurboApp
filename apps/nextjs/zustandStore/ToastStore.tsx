import React, { useEffect } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RouterOutputs } from "../src/utils/trpc";

type ToastContent = {
  title: string;
  description: string;
  type: "success" | "error" | "warning" | "info" | "";
};
type Store = {
  open: Boolean;
  setOpenOnClique: () => void;
  content: ToastContent;
  setContent: (content: ToastContent) => void;
  setOpen: (open: Boolean) => void;
  timeoutId: ReturnType<typeof setTimeout> | null;
};

export const useToastStore = create(
  immer<Store>((set, get) => ({
    open: false,
    content: {
      title: "",
      description: "",
      type: "",
    },
    timeoutId: null,
    setOpenOnClique: () => {
      set((state) => {
        state.open = false;
      });
      const currentState = get();
      if (currentState.timeoutId) {
        clearTimeout(currentState.timeoutId);
      }
      const timeoutId = setTimeout(() => {
        set((state) => {
          state.open = true;
          state.timeoutId = null;
        });
      }, 100);
      set((state) => {
        state.timeoutId = timeoutId;
      });
    },
    setContent: (content) => {
      set((state) => {
        state.content = content;
      });
    },
    setOpen: (open) => {
      set((state) => {
        state.open = open;
      });
    },
  })),
);
