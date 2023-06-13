import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
export const cotacoesRouter = router({
  createCotacao: protectedProcedure
    .input(
      z.object({
        nome: z.string(),
        ammountOfTradeRepresentative: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdCotacao = await ctx.prisma.cotacoes.create({
        data: {
          nome: input.nome,
          whoCreated: ctx.auth.userId,
          clerkIdOrg: ctx.auth.orgId,
          ammountOfTradeRepresentative: input.ammountOfTradeRepresentative,
        },
        include: {
          Representante: true,
        },
      });
      return createdCotacao;
    }),
  getCotacoes: protectedProcedure.query(async ({ ctx, input }) => {
    const allCotacoes = await ctx.prisma.cotacoes.findMany({
      where: {
        clerkIdOrg: ctx.auth.orgId,
      },
      include: {
        Representante: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return allCotacoes;
  }),
  addProductToCotacao: protectedProcedure
    .input(
      z.object({
        cotacaoId: z.string(),
        produtoId: z.string(),
        quantidade: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdProductOnCotation =
        await ctx.prisma.produtosDaCotacao.create({
          data: {
            produtoId: input.produtoId,
            cotacaoId: input.cotacaoId,
            createdAt: new Date(),
            whoCreated: ctx.auth.userId,
            clerkIdOrg: ctx.auth.orgId,
            quantidade: input.quantidade,
          },
          select: {
            produto: true,
            id: true,
            quantidade: true,
          },
        });
      return createdProductOnCotation;
    }),
  deleteProductFromCotacao: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedProduct = await ctx.prisma.produtosDaCotacao.delete({
        where: {
          id: input.id,
        },
      });
      return deletedProduct;
    }),
  getProductsFromOneCotacao: publicProcedure
    .input(
      z.object({
        idCotacao: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundCotacao = await ctx.prisma.cotacoes.findUnique({
        where: {
          id: input.idCotacao,
        },
        include: {
          produtos: {
            include: {
              produto: true,
            },
          },
        },
      });
      return foundCotacao;
    }),
  getNumberOfCotacoesCotadasEnviadas: protectedProcedure
    .input(
      z.object({
        cotacaoId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const numberOfCotacoesCotadasEnviadas =
        await ctx.prisma.produtoCotado.count({
          where: {
            cotacaoId: input.cotacaoId,
          },
        });
      return numberOfCotacoesCotadasEnviadas;
    }),
  deleteCotacao: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedCotacao = await ctx.prisma.cotacoes.delete({
        where: {
          id: input.id,
        },
      });
      return deletedCotacao;
    }),
  getCotacoesWithProductsCotadosInside: protectedProcedure.query(
    async ({ ctx, input }) => {
      const allCotacoes = await ctx.prisma.cotacoes.findMany({
        where: {
          clerkIdOrg: ctx.auth.orgId,
        },
        include: {
          Representante: true,
          BuyList: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return allCotacoes;
    },
  ),
});
