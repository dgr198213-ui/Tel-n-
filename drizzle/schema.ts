import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  serial,
} from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Supabase Auth identifier (sub/uuid) */
  openId: varchar("openId", { length: 255 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const planStatusEnum = pgEnum("planStatus", ["free", "estandar", "premium"]);

/**
 * Artistas table - Stores artist profiles with subscription and multimedia data
 */
export const artistas = pgTable("artistas", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  userId: integer("userId").notNull(), // Reference to users table
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL-friendly identifier
  nombreArtistico: varchar("nombreArtistico", { length: 255 }).notNull(),
  bio: text("bio"), // Artist biography
  fotoPrincipal: varchar("fotoPrincipal", { length: 512 }), // Main profile photo URL
  fotosExtra: jsonb("fotosExtra").$type<string[]>(), // Array of additional photo URLs
  enlacesVideo: jsonb("enlacesVideo").$type<string[]>(), // Array of video URLs (YouTube, Vimeo, TikTok)
  redesSociales: jsonb("redesSociales").$type<Record<string, string>>(), // Social media links
  planStatus: planStatusEnum("planStatus").default("free").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }), // Stripe customer ID
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }), // Stripe subscription ID
  visitas: integer("visitas").default(0), // Profile view count
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Artista = typeof artistas.$inferSelect;
export type InsertArtista = typeof artistas.$inferInsert;

export const eventStatusEnum = pgEnum("eventStatus", ["pending_moderation", "approved", "rejected", "cancelled"]);

/**
 * Eventos table - Stores event listings with moderation status
 */
export const eventos = pgTable("eventos", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  fecha: timestamp("fecha").notNull(), // Event date/time
  ubicacion: varchar("ubicacion", { length: 255 }).notNull(),
  latitud: decimal("latitud", { precision: 10, scale: 8 }), // For map display
  longitud: decimal("longitud", { precision: 11, scale: 8 }), // For map display
  fotoPrincipal: varchar("fotoPrincipal", { length: 512 }), // Event poster/image
  enlaceExterno: varchar("enlaceExterno", { length: 512 }), // Link to external event page
  disciplinas: jsonb("disciplinas").$type<string[]>(), // Array of art disciplines
  status: eventStatusEnum("status").default("pending_moderation").notNull(),
  tokenAnonimo: varchar("tokenAnonimo", { length: 255 }), // Token for anonymous editing (48h window)
  usuarioId: integer("usuarioId"), // Reference to users table (null if anonymous)
  artistaId: varchar("artistaId", { length: 36 }), // Reference to artistas table (optional)
  visitas: integer("visitas").default(0), // Event view count
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"), // Expiration date for anonymous token
});

export type Evento = typeof eventos.$inferSelect;
export type InsertEvento = typeof eventos.$inferInsert;

export const planAnteriorEnum = pgEnum("planAnterior", ["free", "estandar", "premium"]);
export const planNuevoEnum = pgEnum("planNuevo", ["free", "estandar", "premium"]);

/**
 * Suscripciones table - Tracks subscription history for analytics
 */
export const suscripciones = pgTable("suscripciones", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  artistaId: varchar("artistaId", { length: 36 }).notNull(),
  planAnterior: planAnteriorEnum("planAnterior"),
  planNuevo: planNuevoEnum("planNuevo").notNull(),
  stripeEventId: varchar("stripeEventId", { length: 255 }), // Stripe webhook event ID
  razon: varchar("razon", { length: 255 }), // Reason for change (upgrade, downgrade, payment_failed, etc.)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Suscripcion = typeof suscripciones.$inferSelect;
export type InsertSuscripcion = typeof suscripciones.$inferInsert;
