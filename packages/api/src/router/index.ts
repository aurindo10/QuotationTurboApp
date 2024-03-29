import { router } from "../trpc";
import { buyListRouter } from "./buyList";
import { cotacoesRouter } from "./cotacoes";
import { empresaRouter } from "./empresa";
import { productRouter } from "./product";
import { produtoCotadoRouter } from "./produtoCotado";
import { representanteRouter } from "./representantes";

export const appRouter = router({
  empresa: empresaRouter,
  product: productRouter,
  cotacoes: cotacoesRouter,
  representante: representanteRouter,
  produCotado: produtoCotadoRouter,
  buyList: buyListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
