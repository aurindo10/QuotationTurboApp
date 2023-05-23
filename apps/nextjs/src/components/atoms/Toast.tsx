import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import { useToastStore } from "../../../zustandStore/ToastStore";

export const ToastInfo = () => {
  const [open, setOpen, content] = useToastStore((state) => [
    state.open,
    state.setOpen,
    state.content,
  ]);
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className="data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-white p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
        open={open as boolean}
        onOpenChange={setOpen}
      >
        <Toast.Title className="text-slate12 mb-[5px] text-[15px] font-medium [grid-area:_title]">
          {content.title}
        </Toast.Title>
        <Toast.Description asChild>
          <div>{content.description}</div>
        </Toast.Description>
        <Toast.Action
          className="[grid-area:_action]"
          asChild
          altText="Goto schedule to undo"
        >
          <button className="bg-green2 text-green11 shadow-green7 hover:shadow-green8 focus:shadow-green8 inline-flex h-[25px] items-center justify-center rounded px-[10px] text-xs font-medium leading-[25px] shadow-[inset_0_0_0_1px] hover:shadow-[inset_0_0_0_1px] focus:shadow-[0_0_0_2px]">
            {content.type}
          </button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
};
