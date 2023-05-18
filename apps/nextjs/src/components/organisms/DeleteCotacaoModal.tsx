import { useUser } from "@clerk/nextjs";
import { Plus } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import { useCotacoesStore } from "../../../zustandStore/CotacoesStore";
import { useProductsStore } from "../../../zustandStore/ProductStore";
import { useToastStore } from "../../../zustandStore/ToastStore";
import { trpc } from "../../utils/trpc";
interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cotacaoId: string;
  cotacaoName: string;
}
export const DeleteCotacaoModal = ({
  cotacaoId,
  setOpen,
  open,
  cotacaoName,
}: Props) => {
  const [setToastOpen, setContent] = useToastStore((state) => [
    state.setOpenOnClique,
    state.setContent,
  ]);
  const [deleteCotacaoState] = useCotacoesStore((state) => [
    state.deleteCotacao,
  ]);
  const [isLoading, setIsLoading] = React.useState("");
  const [] = React.useState(false);
  const { user } = useUser();

  const { mutateAsync: deleteCotacao } =
    trpc.cotacoes.deleteCotacao.useMutation();
  const HandleDeleteProduct = async () => {
    setIsLoading("loading");
    const deletedCotacao = await deleteCotacao({ id: cotacaoId });
    if (deletedCotacao) {
      deleteCotacaoState(cotacaoId);
      setIsLoading("");
      setOpen(false);
      setContent({
        title: "Cotação deletada com sucesso",
        description: `A ${cotacaoName} foi deletada com sucesso`,
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
            {`Você tem certeza que deseja apagar ${cotacaoName}?`}
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
