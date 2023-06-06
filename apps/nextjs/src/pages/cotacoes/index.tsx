import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect } from "react";
import { usePageStore } from "../../../zustandStore/PageStore";
import { AddCotacaoModal } from "../../components/pages/cotacoes/index/AddCotacaoModal";
import { CotacoesList } from "../../components/pages/cotacoes/index/CotacoesList";
import { Drawer } from "../../components/template/Drawer";
import { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  const [setTitle] = usePageStore((state) => [state.setTitle]);
  setTitle("Cotações");
  return (
    <div className="py-4 px-2 ">
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
