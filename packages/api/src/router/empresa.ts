import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

export const empresaRouter = router({
  createEmpresa: protectedProcedure
    .input(
      z.object({
        nome: z.string(),
        cnpj: z.string(),
        apelido: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdEmpresa = await ctx.prisma.empresa.create({
        data: {
          nome: input.nome,
          cnpj: input.cnpj,
          apelido: input.apelido,
          whoCreated: ctx.auth.userId,
          createdAt: new Date(),
          active: true,
        },
      });
      return createdEmpresa;
    }),
});
