import { router } from "../trpc";
import { empresaRouter } from "./empresa";
import { productRouter } from "./product";

export const appRouter = router({
  empresa: empresaRouter,
  product: productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
