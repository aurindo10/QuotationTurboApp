import { AppRouter } from "@acme/api";
import { ColumnDef } from "@tanstack/react-table";
import { inferRouterOutputs } from "@trpc/server";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Products = {};
type RouterOutput = inferRouterOutputs<AppRouter>;
export type ProductType = RouterOutput["product"]["getProductsByCotation"];
export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
  },
  {
    accessorKey: "brand",
    header: "Marca",
  },
  {
    accessorKey: "unit",
    header: "Unidade",
  },
];
