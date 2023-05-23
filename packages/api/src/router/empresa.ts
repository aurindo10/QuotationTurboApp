import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
export const empresaRouter = router({
  insertIdEmpresaIntoMetaData: protectedProcedure
    .input(
      z.object({
        idEmpresa: z.string(),
        active: z.boolean(),
        nomeEmpresa: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await clerkClient.users.updateUserMetadata(
        ctx.auth.userId,
        {
          publicMetadata: {
            idEmpresa: input.idEmpresa,
            active: input.active,
            nomeEmpresa: input.nomeEmpresa,
          },
        },
      );
      return updatedUser;
    }),
});
