import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { createClient } from "@supabase/supabase-js";
import { SupabaseAuthAdapter } from "./auth/supabase-auth.adapter";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const authGateway = new SupabaseAuthAdapter(supabase);

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  const authHeader = opts.req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const authUser = await authGateway.verifyToken(token);
    
    if (authUser) {
      // Sync with local users table
      let localUser = await db.getUserByOpenId(authUser.id);
      if (!localUser) {
        await db.upsertUser({
          openId: authUser.id,
          email: authUser.email,
          name: authUser.name,
          loginMethod: authUser.provider,
        });
        localUser = await db.getUserByOpenId(authUser.id);
      }
      user = localUser || null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
