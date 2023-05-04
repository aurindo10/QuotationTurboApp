import { router } from "../trpc";
import { postRouter } from "./post";
import { empresaRouter } from "./empresa";
import { authRouter } from "./auth";

export const appRouter = router({
  post: postRouter,
  empresa: empresaRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
