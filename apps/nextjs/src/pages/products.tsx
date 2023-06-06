import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect } from "react";
import { SearchInput } from "../components/pages/cotacoes/RegisteredProducts/SearchInput";
import { ProductsHeader } from "../components/pages/Products/ProductsHeader";
import { ProductsTabe } from "../components/pages/Products/ProductsTable";
import { Drawer } from "../components/template/Drawer";
import { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
  return (
    <div className="w-full space-y-3 py-4 px-2 md:px-4">
      <div className="flex w-full justify-center">
        <div className="w-full max-w-md space-y-2">
          <SearchInput></SearchInput>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <div className="w-full max-w-7xl">
          <ProductsHeader></ProductsHeader>
          <ProductsTabe></ProductsTabe>
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
