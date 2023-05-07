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
        empresa: z.string(),
        descricao: z.string(),
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
          empresaId: input.empresa,
        },
      });
      return createdEmpresa;
    }),
});
