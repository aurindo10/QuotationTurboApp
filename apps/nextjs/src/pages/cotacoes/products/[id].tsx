import { ReactElement } from "react";

import { ProductsTableCotation } from "../../../components/pages/cotacoes/sentprices/ProductsFromCotation";
import { SubHeaderProductsCotacao } from "../../../components/pages/cotacoes/RegisteredProducts/SubHeaderProductsCotacao";
import { DataTable } from "../../../components/template/data-table";
import { Drawer } from "../../../components/template/Drawer";
import { trpc } from "../../../utils/trpc";
import { NextPageWithLayout } from "../../_app";

const Page: NextPageWithLayout = () => {
  return (
    <div className="w-full space-y-2 px-2">
      <SubHeaderProductsCotacao></SubHeaderProductsCotacao>
      <div className="flex w-full justify-center">
        <div className="w-full max-w-4xl">
          <ProductsTableCotation></ProductsTableCotation>
        </div>
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
