import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
export const representanteRouter = router({
  createRepresentante: publicProcedure
    .input(
      z.object({
        nome: z.string(),
        empresaName: z.string(),
        empresaId: z.string(),
        cotacaoId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdRepresentante = await ctx.prisma.representante.create({
        data: {
          empresaId: input.empresaId,
          empresaName: input.empresaName,
          nome: input.nome,
          cotacaoId: input.cotacaoId,
          createdAt: new Date(),
        },
      });
      return createdRepresentante;
    }),
});
