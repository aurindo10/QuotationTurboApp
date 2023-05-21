import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import useProtectedRoute from "../../../components/atoms/protectedHook";
import { BuyListTableBody } from "../../../components/organisms/BuyListBody";
import { Drawer } from "../../../components/template/Drawer";
import { NextPageWithLayout } from "../../_app";

const Page: NextPageWithLayout = () => {
  return (
    <div className="w-full px-2 py-2 md:px-4">
      <BuyListTableBody></BuyListTableBody>
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
