import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect } from "react";
import { SentPricesBody } from "../../../components/organisms/SentPricesBody";
import { Drawer } from "../../../components/template/Drawer";
import { NextPageWithLayout } from "../../_app";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return <div className="text-slate-50">loading</div>;
  }
  if (!user!.publicMetadata.nomeEmpresa) {
    router.push("/criarempresa");
  }
  return (
    <div className="py-4 px-2 ">
      <SentPricesBody></SentPricesBody>
    </div>
  );
};
Page.getLayout = function IndexPage(page: ReactElement) {
  return (
    <div>
      <Drawer></Drawer>
      {page}
    </div>
  );
};
export default Page;
