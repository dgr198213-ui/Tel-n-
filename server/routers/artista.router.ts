import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  getArtistaByUserId,
  getArtistaBySlug,
} from "../db";
import { UpdateArtistProfileUseCase } from "../use-cases/artista/update-profile.use-case";
import { DrizzleArtistRepository } from "../use-cases/artista/drizzle-artist.repository";

const artistRepo = new DrizzleArtistRepository();
const updateProfileUseCase = new UpdateArtistProfileUseCase(artistRepo);

export const artistaRouter = router({
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

  // Update artist profile using Use Case
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
      return updateProfileUseCase.execute(ctx.user.id, {
        ...input,
        redesSociales: input.redesSociales as Record<string, string> | undefined,
      });
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
});
