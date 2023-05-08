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
      });
      return allCotacoes;
    }),
});
