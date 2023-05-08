import { router } from "../trpc";
import { cotacoesRouter } from "./cotacoes";
import { empresaRouter } from "./empresa";
import { productRouter } from "./product";

export const appRouter = router({
  empresa: empresaRouter,
  product: productRouter,
  cotacoes: cotacoesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
