import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  getEventos,
  getEventoById,
  createEvento,
} from "../db";

export const eventoRouter = router({
  // List approved events
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return getEventos(input.limit, input.offset);
    }),

  // Get single event by ID
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return getEventoById(input.id);
    }),

  // Create event (authenticated or anonymous)
  create: publicProcedure
    .input(
      z.object({
        titulo: z.string().min(1).max(255),
        descripcion: z.string().max(5000).optional(),
        fecha: z.coerce.date(), // Use coerce for better date handling from JSON
        ubicacion: z.string().min(1).max(255),
        fotoPrincipal: z.string().url().optional(),
        enlaceExterno: z.string().url().optional(),
        disciplinas: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await createEvento({
        titulo: input.titulo,
        descripcion: input.descripcion,
        fecha: input.fecha,
        ubicacion: input.ubicacion,
        fotoPrincipal: input.fotoPrincipal,
        enlaceExterno: input.enlaceExterno,
        disciplinas: input.disciplinas,
        usuarioId: ctx.user?.id,
      });

      return result;
    }),
});
