import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
export const productRouter = router({
  createProduct: protectedProcedure
    .input(
      z.object({
        nome: z.string(),
        brand: z.string(),
        unit: z.string(),
        descricao: z.string(),
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdEmpresa = await ctx.prisma.product.create({
        data: {
          nome: input.nome,
          whoCreated: ctx.auth.userId,
          createdAt: new Date(),
          descricao: input.descricao,
          brand: input.brand,
          unit: input.unit,
          clerkIdOrg: ctx.auth.orgId,
          code: input.code,
        },
      });
      return createdEmpresa;
    }),
  getAllProducts: protectedProcedure.query(async ({ ctx, input }) => {
    const allProducts = await ctx.prisma.product.findMany({
      where: {
        clerkIdOrg: ctx.auth.orgId,
      },
    });
    return allProducts;
  }),
  deleteOneProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedProduct = await ctx.prisma.product.delete({
        where: {
          id: input.id,
        },
      });
      return deletedProduct;
    }),
  updateOneProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nome: z.string(),
        descricao: z.string(),
        brand: z.string(),
        unit: z.string(),
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedProduct = await ctx.prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          nome: input.nome,
          descricao: input.descricao,
          brand: input.brand,
          unit: input.unit,
          code: input.code,
        },
      });
      return updatedProduct;
    }),
  getProductsByCotation: protectedProcedure
    .input(
      z.object({
        cotacaoId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundProducts = await ctx.prisma.produtosDaCotacao.findMany({
        where: {
          clerkIdOrg: ctx.auth.orgId,
          cotacaoId: input.cotacaoId,
        },
        select: {
          produto: true,
          id: true,
          quantidade: true,
        },
      });
      return foundProducts;
    }),
  getProductByName: protectedProcedure
    .input(
      z.object({
        nome: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundProduct = await ctx.prisma.product.findMany({
        where: {
          clerkIdOrg: ctx.auth.orgId,
          nome: {
            contains: input.nome,
          },
        },
      });
      return foundProduct;
    }),
});
