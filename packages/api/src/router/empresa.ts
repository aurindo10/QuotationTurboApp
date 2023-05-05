import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
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
  insertIdEmpresaIntoMetaData: protectedProcedure
    .input(
      z.object({
        idEmpresa: z.string(),
        active: z.boolean(),
        nomeEmpresa: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await clerkClient.users.updateUserMetadata(
        ctx.auth.userId,
        {
          publicMetadata: {
            idEmpresa: input.idEmpresa,
            active: input.active,
            nomeEmpresa: input.nomeEmpresa,
          },
        },
      );
      return updatedUser;
    }),
});
