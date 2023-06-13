import { useUser } from "@clerk/nextjs";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { usePageStore } from "../../../zustandStore/PageStore";
import { CotationBuyListPage } from "../../components/pages/buylist/CotationBuyListPage";
import { Drawer } from "../../components/template/Drawer";
import { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  const [setTitle] = usePageStore((state) => [state.setTitle]);
  useEffect(() => {
    setTitle("Listas de compras");
  });
  return (
    <div className="w-full px-2 py-4 md:px-4">
      <CotationBuyListPage></CotationBuyListPage>
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
