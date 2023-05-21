import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { CotationBuyListPage } from "../../components/organisms/CotationBuyListPage";
import { Drawer } from "../../components/template/Drawer";
import { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return <div className="text-slate-50">loading</div>;
  }
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
