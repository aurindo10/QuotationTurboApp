import { useUser } from "@clerk/nextjs";
import { Plus } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { useProductsOfCotationStore } from "../../../zustandStore/ProductsOfCotationStore";
import { useProductsStore } from "../../../zustandStore/ProductStore";
import { useSentPricesStore } from "../../../zustandStore/SentPrices";
import { useToastStore } from "../../../zustandStore/ToastStore";
import { trpc } from "../../utils/trpc";
interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  representanteId: string;
  representanteName: string;
}
export const DeletePriceListCotado = ({
  open,
  setOpen,
  representanteId,
  representanteName,
}: Props) => {
  const [setToastOpen, setContent] = useToastStore((state) => [
    state.setOpenOnClique,
    state.setContent,
  ]);

  const [isLoading, setIsLoading] = React.useState("");
  const [] = React.useState(false);
  const [deleteSentPrices] = useSentPricesStore((state) => [
    state.deleteSentPrices,
  ]);
  const { mutateAsync: deleteProdutosCotados } =
    trpc.produCotado.deleteProdutosCotados.useMutation();
  const HandleDeleteProduct = async () => {
    setIsLoading("loading");
    const deletedProdcutCotados = await deleteProdutosCotados({
      representanteId: representanteId,
    });
    if (deletedProdcutCotados) {
      setIsLoading("");
      deleteSentPrices(representanteId);
      setOpen(false);
      setContent({
        title: "Produtos do representante deletado com sucesso",
        description: `Os produtos do  ${representanteName} foram deletados com sucesso`,
        type: "success",
      });
      setToastOpen();
    }
  };
  return (
    <Dialog.Root open={open} onOpenChange={() => setOpen(!open)}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-50" />
        <Dialog.Content
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="data-[state=open]:animate-contentShow bg-neutral fixed top-[50%] left-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
        >
          <Dialog.Title className="m-0 text-[17px] font-medium">
            Apagar Produto
          </Dialog.Title>
          <Dialog.Description className="mt-[10px] mb-5 text-[15px] leading-normal">
            {`Você tem certeza que deseja apagar os produtos do representante ${representanteName}?`}
          </Dialog.Description>
          <div className="flex justify-end gap-6">
            <button
              className="btn btn-secondary mt-4"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
            <button
              className={`btn btn-accent mt-4 ${isLoading}`}
              onClick={HandleDeleteProduct}
            >
              Deletar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
