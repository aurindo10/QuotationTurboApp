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
  const { orgSlug } = useAuth();
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
    <div data-theme="mytheme">
      <div className="navbar bg-blue-700">
        <div className="navbar-start bg-blue-700">
          <div className="dropdown z-50 bg-blue-700" ref={dropdownRef}>
            <label
              tabIndex={0}
              className="btn btn-circle btn-ghost"
              onClick={handleDropdownClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            {isOpen && (
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content  rounded-box mt-3 w-52 bg-slate-900 p-2 shadow"
              >
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
              </ul>
            )}
          </div>
        </div>
        <div className="navbar-center">
          <div className="text-[18px] font-bold">{title}</div>
        </div>
        <div className="navbar-end">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      <ToastInfo></ToastInfo>
    </div>
  );
};
