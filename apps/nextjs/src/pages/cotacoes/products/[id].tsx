import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect } from "react";
import { columns } from "../../../components/organisms/columns";
import { DataTable } from "../../../components/template/data-table";
import { Drawer } from "../../../components/template/Drawer";
import { trpc } from "../../../utils/trpc";
import { NextPageWithLayout } from "../../_app";

const Page: NextPageWithLayout = () => {
  const router = useRouter();

  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return <div className="text-slate-50">loading</div>;
  }
  if (!user!.publicMetadata.nomeEmpresa) {
    router.push("/criarempresa");
  }
  const idEmpresa = user?.publicMetadata.idEmpresa as string;
  const { data: allProducts, status: statusGettingProducts } =
    trpc.product.getProductsByCotation.useQuery({
      idEmpresa: idEmpresa,
      cotacaoId: (router.query.id as string) ?? "",
    });
  if (statusGettingProducts === "loading") {
    return <div className=" text-slate-50"> Carregando...</div>;
  }
  return (
    <div className="w-full">
      <DataTable data={[allProducts!]} columns={columns}></DataTable>
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
