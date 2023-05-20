import { useUser } from "@clerk/nextjs";
import { CopySimple, Plus } from "@phosphor-icons/react";
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
}
export const CopyAndPasteModal = ({ cotacaoId, setOpen, open }: Props) => {
  const [setToastOpen, setContent] = useToastStore((state) => [
    state.setOpenOnClique,
    state.setContent,
  ]);
  const [deleteCotacaoState] = useCotacoesStore((state) => [
    state.deleteCotacao,
  ]);
  const { data } = trpc.cotacoes.getProductsFromOneCotacao.useQuery({
    idCotacao: cotacaoId,
  });
  const [isLoading, setIsLoading] = React.useState("");
  const { user } = useUser();

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `localhost:3000/register/${cotacaoId}`,
      );
      setOpen(false);
      setContent({
        title: "Link copiado com sucesso",
        description: `Agora você pode compartilhar o link com os seus representantes`,
        type: "success",
      });
      setToastOpen();
    } catch (error) {
      setContent({
        title: "Link não foi copiado com sucesso",
        description: `Link não copiado`,
        type: "error",
      });
      setToastOpen();
    }
  };
  if (!data) return null;
  return (
    <Dialog.Root open={open} onOpenChange={() => setOpen(!open)}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-50" />
        <Dialog.Content
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="data-[state=open]:animate-contentShow bg-neutral fixed top-[50%] left-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
        >
          <Dialog.Title className="m-0 text-[17px] font-medium">
            Link para compartilhar
          </Dialog.Title>
          <Dialog.Description className="mt-[10px] mb-5 text-[15px] leading-normal">
            Compartilhe este link com os seus representantes para que eles
            possam inserir os valores dos produtos
          </Dialog.Description>
          {data?.produtos.length > 0 ? (
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search…"
                  className="input input-bordered w-full"
                  defaultValue={`localhost:3000/register/${cotacaoId}`}
                />
                <button
                  className="btn btn-square btn-secondary"
                  onClick={handleCopyToClipboard}
                >
                  <CopySimple size={27} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-[30px]">
              Adicione produtos a esta cotação para compartilha-la
            </div>
          )}
          <div className="flex justify-end gap-6">
            <button
              className={`btn btn-accent mt-4 ${isLoading}`}
              onClick={() => setOpen(false)}
            >
              Fechar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
