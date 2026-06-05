import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getArtistaByUserId,
  getArtistaBySlug,
  upsertArtista,
  getEventos,
  getEventoById,
  createEvento,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Artista routes
  artista: router({
    // Get current user's artist profile
    me: protectedProcedure.query(async ({ ctx }) => {
      const artista = await getArtistaByUserId(ctx.user.id);
      return artista || null;
    }),

    // Get artist profile by slug (public)
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const artista = await getArtistaBySlug(input.slug);
        if (!artista) return null;

        // Return only public fields
        return {
          id: artista.id,
          slug: artista.slug,
          nombreArtistico: artista.nombreArtistico,
          bio: artista.bio,
          fotoPrincipal: artista.fotoPrincipal,
          fotosExtra: artista.fotosExtra,
          enlacesVideo: artista.enlacesVideo,
          redesSociales: artista.redesSociales,
          planStatus: artista.planStatus,
          visitas: artista.visitas,
          createdAt: artista.createdAt,
        };
      }),

    // Update artist profile
    update: protectedProcedure
      .input(
        z.object({
          nombreArtistico: z.string().min(1).max(255),
          bio: z.string().max(5000).optional(),
          fotoPrincipal: z.string().url().optional(),
          fotosExtra: z.array(z.string().url()).optional(),
          enlacesVideo: z.array(z.string().url()).optional(),
          redesSociales: z.record(z.string(), z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const artista = await upsertArtista({
          userId: ctx.user.id,
          nombreArtistico: input.nombreArtistico,
          bio: input.bio,
          fotoPrincipal: input.fotoPrincipal,
          fotosExtra: input.fotosExtra,
          enlacesVideo: input.enlacesVideo,
          redesSociales: input.redesSociales as Record<string, string> | undefined,
        });

        return artista;
      }),

    // Get plan limits based on subscription
    getPlanLimits: publicProcedure
      .input(z.object({ planStatus: z.enum(["free", "estandar", "premium"]) }))
      .query(({ input }) => {
        const limits = {
          free: { fotos: 1, videos: 0 },
          estandar: { fotos: 3, videos: 1 },
          premium: { fotos: 3, videos: 3 },
        };
        return limits[input.planStatus];
      }),
  }),

  // Evento routes
  evento: router({
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
          fecha: z.date(),
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
  }),
});

export type AppRouter = typeof appRouter;
