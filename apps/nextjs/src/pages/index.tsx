import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect } from "react";
import { SearchInput } from "../components/molecules/SearchInput";
import { ProductsHeader } from "../components/organisms/ProductsHeader";
import { ProductsTabe } from "../components/organisms/ProductsTable";
import { Drawer } from "../components/template/Drawer";
import { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
  return (
    <div className="w-full py-4 px-2 md:px-4">
      <div>
        {" "}
        Olá, navegue até a pagina de cotação para verificar as suas cotaçoes!
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
