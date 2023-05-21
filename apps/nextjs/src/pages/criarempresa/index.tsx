import { ReactElement, useContext, useEffect } from "react";
import { Alert } from "../../components/molecules/Alert";
import { CreateEmpresaForm } from "../../components/organisms/CreateEmpresaForm";
import { CreateEmpresaHeader } from "../../components/organisms/CreateEmpresaHeader";
import { Drawer } from "../../components/template/Drawer";
import { NextPageWithLayout } from "../_app";

const Page = () => {
  return (
    <div className="h-screen w-full px-2 md:px-4 ">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <CreateEmpresaHeader></CreateEmpresaHeader>
        <CreateEmpresaForm></CreateEmpresaForm>
      </div>
    </div>
  );
};
export default Page;
