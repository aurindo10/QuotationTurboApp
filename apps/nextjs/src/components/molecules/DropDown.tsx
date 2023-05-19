import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import { CopyAndPasteModal } from "../organisms/CopyPasteModal";
interface Props {
  id: string;
}
const DropdownMenuDemo = ({ id }: Props) => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState("pedro");
  const { mutateAsync: compareProductsCotados } =
    trpc.buyList.compareProductsCotados.useMutation();
  const [isLoading, setIsLoading] = React.useState(false);
  const HandleCompareProductsCotados = async () => {
    try {
      setIsLoading(true);
      const comparedProducts = await compareProductsCotados({ cotacaoId: id });
      setIsLoading(false);
      alert("Lista de compras gerada com sucesso");
    } catch ({ message }) {
      setIsLoading(false);
      alert(message);
    }
  };
  const router = useRouter();
  return (
    <div>
      <button
        className={`btn btn-square loading btn-sm  mr-2 ${
          isLoading ? "" : "hidden"
        }`}
      ></button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="hover:bg-primary bg-neutral focus:shadow-neutral inline-flex h-[35px] w-[35px] items-center justify-center rounded-full shadow-[0_2px_10px] shadow-gray-700 outline-none focus:shadow-[0_0_0_2px]"
            aria-label="Customise options"
          >
            <HamburgerMenuIcon />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade bg-neutral min-w-[50px] rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
            sideOffset={5}
            align={"end"}
          >
            <div className="w-32 space-y-1">
              <Link href={`/cotacoes/sentprices/${id}`}>
                <DropdownMenu.Item className="btn  btn-sm w-full">
                  Abrir
                </DropdownMenu.Item>
              </Link>
              <Link href={`/cotacoes/products/${id}`}>
                <DropdownMenu.Item className="btn  btn-xs w-full">
                  Editar
                </DropdownMenu.Item>
              </Link>
              <DropdownMenu.Item
                className="btn  btn-sm w-full"
                onClick={HandleCompareProductsCotados}
              >
                Gerar
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="btn btn-xs w-full"
                onClick={() => setIsOpen(true)}
              >
                Compartilhar
              </DropdownMenu.Item>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <CopyAndPasteModal
        cotacaoId={id}
        open={isOpen}
        setOpen={setIsOpen}
      ></CopyAndPasteModal>
    </div>
  );
};

export default DropdownMenuDemo;
// router.push(`/register/${id}`)
