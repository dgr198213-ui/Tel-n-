import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/routers";
import { supabase } from "./supabase";

export const trpc = createTRPCReact<AppRouter>();

export const getTrpcLinks = () => {
  return {
    async headers() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        return {
          Authorization: `Bearer ${session.access_token}`,
        };
      }
      return {};
    },
  };
};
