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
      const createdProductCotado = await ctx.prisma.produtoCotado.createMany({
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
  addManyProductsCotados: publicProcedure
    .input(
      z.object({
        products: z.array(
          z.object({
            valor: z.number(),
            cotacaoId: z.string(),
            representanteId: z.string(),
            quantidadeMinima: z.number(),
            produtoDaCotacaoId: z.string(),
            code: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const addedProdutosCotados = await ctx.prisma.produtoCotado.createMany({
        data: input.products,
      });
      return { message: "Produtos enviado com sucesso", status: 200 };
    }),
  getListOfPricesByCotationId: protectedProcedure
    .input(
      z.object({
        cotacaoId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const representantes = await ctx.prisma.representante.findMany({
        where: {
          cotacaoId: input.cotacaoId,
          produtoCotado: {
            some: {},
          },
        },
      });
      return representantes;
    }),
  deleteProdutosCotados: protectedProcedure
    .input(
      z.object({
        representanteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deleteProdutosCotados = await ctx.prisma.representante.deleteMany({
        where: {
          id: input.representanteId,
        },
      });
      return deleteProdutosCotados;
    }),
  getProdutoCotadoByCotationIdAndSellerId: protectedProcedure
    .input(
      z.object({
        cotationId: z.string(),
        sellerId: z.string(),
        skip: z.number(),
        take: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const allProductsBySeller = await ctx.prisma.produtoCotado.findMany({
        where: {
          cotacaoId: input.cotationId,
          representanteId: input.sellerId,
        },
        include: {
          produtoDaCotacao: {
            include: {
              produto: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: input.skip,
        take: input.take,
      });
      return allProductsBySeller;
    }),
  getNumberOfProdutoCotadoByCotationIdAndSellerId: protectedProcedure
    .input(z.object({ cotationId: z.string(), sellerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const numberOfprodutoCotado = await ctx.prisma.produtoCotado.count({
        where: {
          cotacaoId: input.cotationId,
          representanteId: input.sellerId,
        },
      });
      return numberOfprodutoCotado;
    }),
});
