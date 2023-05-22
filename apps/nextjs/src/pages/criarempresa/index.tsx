import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect } from "react";
import { Alert } from "../../components/molecules/Alert";
import { CreateEmpresaForm } from "../../components/organisms/CreateEmpresaForm";
import { CreateEmpresaHeader } from "../../components/organisms/CreateEmpresaHeader";
import { Drawer } from "../../components/template/Drawer";
import { NextPageWithLayout } from "../_app";

const Page = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (user?.publicMetadata.idEmpresa && isLoaded) {
      router.replace({
        pathname: "/cotacoes",
      });
    }
  }, [isLoaded, user, router]);
  if (isLoaded === false || user?.publicMetadata.idEmpresa) {
    return <div className="text-[30px]"> Carregando...</div>;
  }
  return (
    <div className="h-screen w-full px-2 md:px-4 ">
      <div className="flex w-full justify-end px-2 py-2">
        <UserButton />
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <CreateEmpresaHeader></CreateEmpresaHeader>
        <CreateEmpresaForm></CreateEmpresaForm>
      </div>
    </div>
  );
};
export default Page;
