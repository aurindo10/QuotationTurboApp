import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { TRPCClientError } from "@trpc/client";
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
      const isThereProdutoCotado = await ctx.prisma.produtoCotado.findMany({
        where: {
          cotacaoId: input.cotacaoId,
        },
      });
      if (!isThereProdutoCotado[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Não há produtos cotados para essa cotação",
          cause: "sdasd",
        });
      } else {
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
      }
    }),
  getBuyListByCotation: protectedProcedure
    .input(
      z.object({
        cotacaoId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const buyList = await ctx.prisma.representante.findMany({
        where: {
          cotacaoId: input.cotacaoId,
        },
        select: {
          nome: true,
          id: true,
          buyList: {
            select: {
              produtoCotado: {
                select: {
                  id: true,
                  valor: true,
                  produtoDaCotacao: {
                    select: {
                      produto: {
                        select: {
                          nome: true,
                          code: true,
                          descricao: true,
                          unit: true,
                          brand: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      return buyList;
    }),
});
