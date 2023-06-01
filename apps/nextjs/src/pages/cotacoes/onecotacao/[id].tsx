import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect } from "react";
import { SentPricesBody } from "../../../components/pages/cotacoes/sentprices/SentPricesBody";
import { Drawer } from "../../../components/template/Drawer";
import { MainTab } from "../../../components/template/MainTab";
import { NextPageWithLayout } from "../../_app";

const Page: NextPageWithLayout = () => {
  return (
    <div className="py-4 px-1 ">
      <MainTab></MainTab>
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
