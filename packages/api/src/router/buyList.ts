import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { TRPCClientError } from "@trpc/client";

type ProdutoCotado = {
  id: string;
  valor: number | null;
  representanteId: string;
};

type ProdutoDaCotacao = {
  cotacaoId: string;
  produtoCotado: ProdutoCotado[];
};
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
            produtoCotado: {
              some: {},
            },
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
          (produtoDaCotacao: ProdutoDaCotacao) => {
            // Verifica se produtoCotado não é nulo, indefinido ou vazio
            if (
              !produtoDaCotacao.produtoCotado ||
              produtoDaCotacao.produtoCotado.length === 0
            ) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Não há produtos cotados para essa cotação",
              });
            }

            const cheapestProduct = produtoDaCotacao.produtoCotado.reduce(
              (prev: ProdutoCotado, current: ProdutoCotado) => {
                // Verifica se os valores são números e não são nulos
                if (typeof prev.valor !== "number" || prev.valor === null) {
                  throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Valor anterior inválido",
                  });
                }

                if (
                  typeof current.valor !== "number" ||
                  current.valor === null
                ) {
                  throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Valor atual inválido",
                  });
                }

                // Faz a comparação
                return (prev.valor === 0 ? 1000000000 : prev.valor) <
                  (current.valor === 0 ? 1000000000 : current.valor)
                  ? prev
                  : current;
              },
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
                      id: true,
                      quantidade: true,
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
  getPriceOfProductCotadoByProduct: protectedProcedure
    .input(
      z.object({
        cotacaoId: z.string(),
        produtoDaCotacaoId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const foundProduct = await ctx.prisma.representante.findMany({
        where: {
          cotacaoId: input.cotacaoId,
          produtoCotado: {
            some: {
              produtoDaCotacaoId: input.produtoDaCotacaoId,
            },
          },
        },
        include: {
          produtoCotado: {
            orderBy: {
              valor: "asc",
            },
          },
        },
      });
      return foundProduct;
    }),
  transferProduct: protectedProcedure
    .input(
      z.object({
        productFromBuyListId: z.string(),
        idProdutoCotadoToCreateProductFromBuyList: z.string(),
        cotacaoId: z.string(),
        representanteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedProductFromBuyList = ctx.prisma.buyList.deleteMany({
        where: {
          produtoCotadoId: input.productFromBuyListId,
        },
      });
      const createdProductBuyList = ctx.prisma.buyList.create({
        data: {
          clerkIdOrg: ctx.auth.orgId,
          cotacaoId: input.cotacaoId,
          produtoCotadoId: input.idProdutoCotadoToCreateProductFromBuyList,
          representanteId: input.representanteId,
        },
        include: {
          produtoCotado: {
            select: {
              id: true,
              valor: true,
              code: true,
              produtoDaCotacao: {
                select: {
                  id: true,
                  quantidade: true,
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
      });
      const [statte01, state02] = await ctx.prisma.$transaction([
        deletedProductFromBuyList,
        createdProductBuyList,
      ]);
      if (statte01 && state02) {
        return state02;
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: "não foi possível transferir o produto",
        });
      }
    }),
});
