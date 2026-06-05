import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { artistaRouter } from "./routers/artista.router";
import { eventoRouter } from "./routers/evento.router";
import { stripeRouter } from "./routers/stripe.router";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    // Logout is handled client-side with Supabase
    logout: publicProcedure.mutation(() => {
      return { success: true } as const;
    }),
  }),
  artista: artistaRouter,
  evento: eventoRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;
