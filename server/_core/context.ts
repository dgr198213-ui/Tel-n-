import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

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
    try {
      const { data: { user: sbUser }, error } = await supabase.auth.getUser(token);
      
      if (sbUser && !error) {
        // Sync with local users table
        let localUser = await db.getUserByOpenId(sbUser.id);
        if (!localUser) {
          await db.upsertUser({
            openId: sbUser.id,
            email: sbUser.email,
            name: sbUser.user_metadata?.full_name || sbUser.email?.split("@")[0],
            loginMethod: sbUser.app_metadata?.provider || "email",
          });
          localUser = await db.getUserByOpenId(sbUser.id);
        }
        user = localUser || null;
      }
    } catch (error) {
      console.error("[Auth] Supabase verification failed", error);
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
