import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { RouterOutputs } from "../../utils/trpc";

type getProductByNameType = RouterOutputs["product"]["getProductByName"];
interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  products: getProductByNameType;
}

export const InputDropdown = ({ isOpen, setIsOpen, products }: Props) => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState("pedro");
  const router = useRouter();
  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DropdownMenu.Trigger></DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade bg-neutral min-w-[50px] rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
          sideOffset={5}
        >
          <div className="w-32 space-y-1">
            {products.map((product) => {
              return (
                <DropdownMenu.Item
                  className="btn  btn-sm w-full"
                  key={product.id}
                >
                  {product.nome}
                </DropdownMenu.Item>
              );
            })}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
