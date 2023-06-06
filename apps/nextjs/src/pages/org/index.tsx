import { ReactElement } from "react";
import { usePageStore } from "../../../zustandStore/PageStore";
import { CotationBuyListPage } from "../../components/pages/buylist/CotationBuyListPage";
import RadioGroupDemo from "../../components/pages/org/switcher";
import { Drawer } from "../../components/template/Drawer";
import { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  const [setTitle] = usePageStore((state) => [state.setTitle]);
  setTitle("Empresas");
  return (
    <div className="w-full px-2 py-4 md:px-4">
      <div className="flex items-center justify-center">
        <RadioGroupDemo></RadioGroupDemo>
      </div>
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
