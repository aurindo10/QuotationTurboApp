import { router } from "../trpc";
import { empresaRouter } from "./empresa";

export const appRouter = router({
  empresa: empresaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
