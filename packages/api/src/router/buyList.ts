import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
export const buyListRouter = router({
  compareProductsCotados: protectedProcedure
    .input(
      z.object({
        cotacaoId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const allProductsFromCotacao =
        await ctx.prisma.produtosDaCotacao.findMany({
          where: {
            cotacaoId: input.cotacaoId,
          },
          include: {
            produtoCotado: true,
          },
        });
      const productsCompared = allProductsFromCotacao.map(
        (produtoDaCotacao) => {
          const cheapestProduct = produtoDaCotacao.produtoCotado.reduce(
            (prev, current) =>
              (prev.valor === 0 ? 99999999 : prev.valor! < current.valor!)
                ? prev
                : current,
          );
          return {
            produtoCotadoId: cheapestProduct.id,
            cotacaoId: produtoDaCotacao.cotacaoId,
            representanteId: cheapestProduct.representanteId,
          };
        },
      );
      const createdBuyList = await ctx.prisma.buyList.createMany({
        data: productsCompared,
      });
      return createdBuyList;
    }),
});
