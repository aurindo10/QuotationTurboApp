import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div data-theme="mytheme">
      <div className="navbar bg-neutral">
        <div className="navbar-start">
          <div className="dropdown" ref={dropdownRef}>
            <label
              tabIndex={0}
              className="btn btn-circle"
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
                className="menu menu-compact dropdown-content  bg-neutral rounded-box mt-3 w-52 p-2 shadow"
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
              </ul>
            )}
          </div>
        </div>
        <div className="navbar-center">
          <a className="btn text-xl normal-case">{orgSlug}</a>
        </div>
        <div className="navbar-end">
          <button className="btn btn-circle"></button>
          <div className="px-2">
            <OrganizationSwitcher afterSwitchOrganizationUrl="/" hidePersonal />
          </div>
          <button className="btn  btn-circle">
            <UserButton afterSignOutUrl="/" />
          </button>
        </div>
      </div>
      <ToastInfo></ToastInfo>
    </div>
  );
};
