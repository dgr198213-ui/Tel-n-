import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, artistas, eventos, suscripciones } from "../drizzle/schema";
import { ENV } from './_core/env';
import { nanoid } from 'nanoid';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get artist profile by user ID
 */
export async function getArtistaByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(artistas).where(eq(artistas.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get artist profile by slug
 */
export async function getArtistaBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(artistas).where(eq(artistas.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create or update artist profile
 */
export async function upsertArtista(data: {
  userId: number;
  nombreArtistico: string;
  slug?: string;
  bio?: string;
  fotoPrincipal?: string;
  fotosExtra?: string[];
  enlacesVideo?: string[];
  redesSociales?: Record<string, string>;
  planStatus?: 'free' | 'estandar' | 'premium';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if artist already exists
  const existing = await getArtistaByUserId(data.userId);

  // Generate slug if not provided
  let slug = data.slug;
  if (!slug) {
    const baseSlug = data.nombreArtistico
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug is unique
    let finalSlug = baseSlug;
    let counter = 1;
    while (true) {
      const exists = await getArtistaBySlug(finalSlug);
      if (!exists) break;
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    slug = finalSlug;
  }

  if (existing) {
    // Update existing - only update provided fields
    const updateData: any = {
      nombreArtistico: data.nombreArtistico,
    };

    if (data.bio !== undefined) updateData.bio = data.bio || null;
    if (data.fotoPrincipal !== undefined) updateData.fotoPrincipal = data.fotoPrincipal || null;
    if (data.fotosExtra !== undefined) updateData.fotosExtra = data.fotosExtra || null;
    if (data.enlacesVideo !== undefined) updateData.enlacesVideo = data.enlacesVideo || null;
    if (data.redesSociales !== undefined) updateData.redesSociales = data.redesSociales || null;
    if (data.planStatus !== undefined) updateData.planStatus = data.planStatus;
    if (data.stripeCustomerId !== undefined) updateData.stripeCustomerId = data.stripeCustomerId || null;
    if (data.stripeSubscriptionId !== undefined) updateData.stripeSubscriptionId = data.stripeSubscriptionId || null;

    await db.update(artistas)
      .set(updateData)
      .where(eq(artistas.userId, data.userId));

    // Return updated record
    const updated = await getArtistaByUserId(data.userId);
    return updated || existing;
  } else {
    // Create new
    const id = nanoid();
    const insertData: any = {
      id,
      userId: data.userId,
      slug,
      nombreArtistico: data.nombreArtistico,
      bio: data.bio || null,
      fotoPrincipal: data.fotoPrincipal || null,
      fotosExtra: data.fotosExtra || null,
      enlacesVideo: data.enlacesVideo || null,
      redesSociales: data.redesSociales || null,
      planStatus: data.planStatus || 'free',
      stripeCustomerId: data.stripeCustomerId || null,
      stripeSubscriptionId: data.stripeSubscriptionId || null,
    };

    await db.insert(artistas).values(insertData);

    return {
      id,
      userId: data.userId,
      slug,
      nombreArtistico: data.nombreArtistico,
      bio: data.bio,
      fotoPrincipal: data.fotoPrincipal,
      fotosExtra: data.fotosExtra || [],
      enlacesVideo: data.enlacesVideo || [],
      redesSociales: data.redesSociales || {},
      planStatus: data.planStatus || 'free',
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId,
      visitas: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

/**
 * Get approved events with pagination
 */
export async function getEventos(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return db.select()
    .from(eventos)
    .where(eq(eventos.status, 'approved'))
    .limit(limit)
    .offset(offset);
}

/**
 * Get evento by ID
 */
export async function getEventoById(id: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(eventos).where(eq(eventos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create evento
 */
export async function createEvento(data: {
  titulo: string;
  descripcion?: string;
  fecha: Date;
  ubicacion: string;
  fotoPrincipal?: string;
  enlaceExterno?: string;
  disciplinas?: string[];
  usuarioId?: number;
  artistaId?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = nanoid();
  const tokenAnonimo = nanoid(32);

  const insertData: any = {
    id,
    titulo: data.titulo,
    descripcion: data.descripcion || null,
    fecha: data.fecha,
    ubicacion: data.ubicacion,
    fotoPrincipal: data.fotoPrincipal || null,
    enlaceExterno: data.enlaceExterno || null,
    disciplinas: data.disciplinas ? data.disciplinas : null,
    status: data.usuarioId ? 'approved' : 'pending_moderation',
    tokenAnonimo: data.usuarioId ? null : tokenAnonimo,
    usuarioId: data.usuarioId || null,
    artistaId: data.artistaId || null,
    expiresAt: data.usuarioId ? null : new Date(Date.now() + 48 * 60 * 60 * 1000),
  };

  await db.insert(eventos).values(insertData);

  return { id, tokenAnonimo };
}

/**
 * Record subscription change
 */
export async function recordSuscripcionChange(data: {
  artistaId: string;
  planAnterior?: 'free' | 'estandar' | 'premium';
  planNuevo: 'free' | 'estandar' | 'premium';
  stripeEventId?: string;
  razon: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(suscripciones).values({
    id: nanoid(),
    artistaId: data.artistaId,
    planAnterior: data.planAnterior,
    planNuevo: data.planNuevo,
    stripeEventId: data.stripeEventId,
    razon: data.razon,
  });
}
