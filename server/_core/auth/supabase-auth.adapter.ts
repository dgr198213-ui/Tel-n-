import { SupabaseClient } from "@supabase/supabase-js";
import { AuthUser, IAuthGateway } from "./auth.gateway";

export class SupabaseAuthAdapter implements IAuthGateway {
  constructor(private supabase: SupabaseClient) {}

  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser(token);
      
      if (error || !user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email || null,
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || null,
        provider: user.app_metadata?.provider || "email",
      };
    } catch (error) {
      console.error("[AuthAdapter] Token verification failed", error);
      return null;
    }
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    try {
      // In Supabase, we might need service role to get any user by ID if not the current session
      const { data: { user }, error } = await this.supabase.auth.admin.getUserById(id);
      
      if (error || !user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email || null,
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || null,
        provider: user.app_metadata?.provider || "email",
      };
    } catch (error) {
      console.error("[AuthAdapter] Get user by ID failed", error);
      return null;
    }
  }
}
