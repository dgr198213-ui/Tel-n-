import { artistas } from "../../../drizzle/schema";

export type Artist = typeof artistas.$inferSelect;

export interface IArtistRepository {
  findByUserId(userId: number): Promise<Artist | undefined>;
  findBySlug(slug: string): Promise<Artist | undefined>;
  update(userId: number, data: Partial<Artist>): Promise<Artist>;
}
