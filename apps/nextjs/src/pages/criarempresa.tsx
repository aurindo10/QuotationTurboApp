import { ReactElement, useContext, useEffect } from "react";
import { CreateEmpresaForm } from "../components/organisms/CreateEmpresaForm";
import { Drawer } from "../components/template/Drawer";
import { NextPageWithLayout } from "./_app";

const Page = () => {
  return (
    <div className="h-screen w-full ">
      <div className="flex h-full w-full items-center justify-center">
        <CreateEmpresaForm></CreateEmpresaForm>
      </div>
    </div>
  );
};
export default Page;
