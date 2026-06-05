import { IArtistRepository, Artist } from "./artist.repository";
import { upsertArtista, getArtistaByUserId, getArtistaBySlug } from "../../db";

export class DrizzleArtistRepository implements IArtistRepository {
  async findByUserId(userId: number): Promise<Artist | undefined> {
    const result = await getArtistaByUserId(userId);
    return result as Artist | undefined;
  }

  async findBySlug(slug: string): Promise<Artist | undefined> {
    const result = await getArtistaBySlug(slug);
    return result as Artist | undefined;
  }

  async update(userId: number, data: Partial<Artist>): Promise<Artist> {
    const result = await upsertArtista({
      userId,
      nombreArtistico: data.nombreArtistico!,
      ...data,
    });
    return result as Artist;
  }
}
