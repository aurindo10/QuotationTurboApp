import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect } from "react";
import { AddCotacaoModal } from "../../components/organisms/AddCotacaoModal";
import { CotacoesList } from "../../components/organisms/CotacoesList";
import { Drawer } from "../../components/template/Drawer";
import { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  return (
    <div className="py-4 px-2 ">
      <div className="flex justify-center">
        <div className="flex w-full max-w-xl justify-end">
          <AddCotacaoModal></AddCotacaoModal>
        </div>
      </div>
      <CotacoesList></CotacoesList>
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
