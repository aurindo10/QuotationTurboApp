import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect } from "react";
import { SearchInput } from "../components/molecules/SearchInput";
import { ProductsTabe } from "../components/organisms/ProductsTable";
import { Drawer } from "../components/template/Drawer";
import { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return <div className="text-slate-50">loading</div>;
  }
  if (!user!.publicMetadata.nomeEmpresa) {
    router.push("/criarempresa");
  }
  return (
    <div className="w-full space-y-3 py-4 px-2 md:px-4">
      <div className="flex w-full justify-center">
        <div className="w-full max-w-md ">
          <SearchInput></SearchInput>
        </div>
      </div>
      <ProductsTabe></ProductsTabe>
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
