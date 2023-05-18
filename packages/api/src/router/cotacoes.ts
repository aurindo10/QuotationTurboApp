import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
export const cotacoesRouter = router({
  createCotacao: protectedProcedure
    .input(
      z.object({
        nome: z.string(),
        empresaId: z.string(),
        ammountOfTradeRepresentative: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdCotacao = await ctx.prisma.cotacoes.create({
        data: {
          nome: input.nome,
          whoCreated: ctx.auth.userId,
          empresaId: input.empresaId,
          ammountOfTradeRepresentative: input.ammountOfTradeRepresentative,
        },
      });
      return createdCotacao;
    }),
  getCotacoes: protectedProcedure
    .input(
      z.object({
        empresaId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const allCotacoes = await ctx.prisma.cotacoes.findMany({
        where: {
          empresaId: input.empresaId,
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
        empresaId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const createdProductOnCotation =
        await ctx.prisma.produtosDaCotacao.create({
          data: {
            produtoId: input.produtoId,
            cotacaoId: input.cotacaoId,
            createdAt: new Date(),
            whoCreated: ctx.auth.userId,
            empresaId: input.empresaId,
            quantidade: input.quantidade,
          },
          select: {
            produto: true,
            id: true,
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
      console.log(input);
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
    .query(async ({ ctx, input }) => {
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
});
