import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import Link from "next/link";
interface Props {
  id: string;
}
const DropdownMenuBuyList = ({ id }: Props) => {
  const router = useRouter();
  return (
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
            <Link href={`/buylist/products/${id}`}>
              <DropdownMenu.Item className="btn  btn-sm w-full">
                Abrir
              </DropdownMenu.Item>
            </Link>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DropdownMenuBuyList;
