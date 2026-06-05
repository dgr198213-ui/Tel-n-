import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";

export const stripeRouter = router({
  createCheckout: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["estandar", "premium"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { createCheckoutSession } = await import("../stripe");
      const url = await createCheckoutSession(
        ctx.user.id,
        ctx.user.email || "",
        ctx.user.name || "Artist",
        input.plan,
        ctx.req.headers.origin || "http://localhost:3000"
      );
      return { url };
    }),
});
