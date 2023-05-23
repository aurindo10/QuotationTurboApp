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
      const isThereBuyList = await ctx.prisma.buyList.findMany({
        where: {
          cotacaoId: input.cotacaoId,
        },
      });
      if (isThereBuyList[0]) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Já existe uma lista de compras para essa cotação",
        });
      }
      if (!isThereProdutoCotado[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Não há produtos cotados para essa cotação",
        });
      } else {
        const productsCompared = allProductsFromCotacao.map(
          (produtoDaCotacao) => {
            const cheapestProduct = produtoDaCotacao.produtoCotado.reduce(
              (prev, current) =>
                (
                  prev.valor === 0
                    ? 1000000000
                    : prev.valor! <
                      (current.valor === 0 ? 100000000 : current.valor!)
                )
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
          empresaName: true,
          buyList: {
            select: {
              produtoCotado: {
                select: {
                  id: true,
                  valor: true,
                  code: true,
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
  deleteBuyList: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedBuyList = await ctx.prisma.buyList.deleteMany({
        where: {
          cotacaoId: input.id,
        },
      });
      return deletedBuyList;
    }),
});
