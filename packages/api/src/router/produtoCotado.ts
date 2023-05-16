import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
export const produtoCotadoRouter = router({
  addProductCotado: publicProcedure
    .input(
      z.object({
        valor: z.number(),
        cotacaoId: z.string(),
        representanteId: z.string(),
        quantidadeMinima: z.number(),
        produtoDaCotacaoId: z.string(),
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdProductCotado = await ctx.prisma.produtoCotado.create({
        data: {
          valor: input.valor,
          cotacaoId: input.cotacaoId,
          createdAt: new Date(),
          representanteId: input.representanteId,
          quantidadeMinima: input.quantidadeMinima,
          produtoDaCotacaoId: input.produtoDaCotacaoId,
          code: input.code,
        },
      });
      return createdProductCotado;
    }),
});
