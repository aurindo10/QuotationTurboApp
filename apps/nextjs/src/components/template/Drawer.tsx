import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePageStore } from "../../../zustandStore/PageStore";
import { ToastInfo } from "../atoms/Toast";

export const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };
  const [checked, setChcked] = useState(false);
  const [title, setTitle] = usePageStore((state) => [
    state.title,
    state.setTitle,
  ]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="drawer z-50">
      <input
        id="my-drawer-3"
        type="checkbox"
        checked={checked}
        onChange={() => setChcked(!checked)}
        className="drawer-toggle"
      />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar  w-full  bg-blue-700">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 text-[20px] font-bold">{title}</div>
          <div className="hidden h-12 items-center lg:block">
            <ul className="menu menu-horizontal">
              <li>
                <Link href={"/cotacoes"} onClick={closeDropdown}>
                  Cotações
                </Link>
              </li>
              <li>
                <Link href={"/products"} onClick={closeDropdown}>
                  Produtos
                </Link>
              </li>
              <li>
                <Link href={"/buylist"} onClick={closeDropdown}>
                  Lista de compras
                </Link>
              </li>
              <li>
                <Link href={"/org"} onClick={closeDropdown}>
                  Empresas
                </Link>
              </li>
              <li className="mt-[-8px] flex items-center justify-center">
                <UserButton afterSignOutUrl="/" />
              </li>
            </ul>
          </div>
          <div className="my-0 py-0 lg:hidden">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu h-full w-52 bg-slate-800 p-4">
          {/* Sidebar content here */}
          <li
            onClick={() => {
              setChcked(false);
            }}
          >
            <Link href={"/cotacoes"} onClick={closeDropdown}>
              Cotações
            </Link>
          </li>
          <li
            onClick={() => {
              setChcked(false);
            }}
          >
            <Link href={"/products"} onClick={closeDropdown}>
              Produtos
            </Link>
          </li>
          <li
            onClick={() => {
              setChcked(false);
            }}
          >
            <Link href={"/buylist"} onClick={closeDropdown}>
              Lista de compras
            </Link>
          </li>
          <li
            onClick={() => {
              setChcked(false);
            }}
          >
            <Link href={"/org"} onClick={closeDropdown}>
              Empresas
            </Link>
          </li>
        </ul>
      </div>
      <ToastInfo></ToastInfo>
      <div className="navbar-end"></div>
    </div>
  );
};
