import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect } from "react";
import { useProductsOfCotationStore } from "../../../../zustandStore/ProductsOfCotationStore";
import { InputToAddProductOnCotation } from "../../../components/atoms/AddProductInput";
import { columns } from "../../../components/organisms/columns";
import { ProductsTableCotation } from "../../../components/organisms/ProductsFromCotation";
import { SubHeaderProductsCotacao } from "../../../components/organisms/SubHeaderProductsCotacao";
import { DataTable } from "../../../components/template/data-table";
import { Drawer } from "../../../components/template/Drawer";
import { trpc } from "../../../utils/trpc";
import { NextPageWithLayout } from "../../_app";

const Page: NextPageWithLayout = () => {
  return (
    <div className="w-full px-2">
      <SubHeaderProductsCotacao></SubHeaderProductsCotacao>
      <ProductsTableCotation></ProductsTableCotation>
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
