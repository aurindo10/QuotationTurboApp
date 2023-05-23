import { CreateOrganization, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect } from "react";
import { Alert } from "../../components/molecules/Alert";
import { CreateEmpresaForm } from "../../components/organisms/CreateEmpresaForm";
import { CreateEmpresaHeader } from "../../components/organisms/CreateEmpresaHeader";
import { Drawer } from "../../components/template/Drawer";
import { NextPageWithLayout } from "../_app";

const Page = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center px-2 md:px-4 ">
      <CreateOrganization />
    </div>
  );
};
export default Page;
