import { useUser } from "@clerk/nextjs";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import useProtectedRoute from "../../components/atoms/protectedHook";
import { CotationBuyListPage } from "../../components/organisms/CotationBuyListPage";
import { Drawer } from "../../components/template/Drawer";
import { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  return (
    <div className="w-full px-2 md:px-4">
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
