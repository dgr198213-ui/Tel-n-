import {
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Artistas table - Stores artist profiles with subscription and multimedia data
 */
export const artistas = mysqlTable("artistas", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  userId: int("userId").notNull(), // Reference to users table
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL-friendly identifier
  nombreArtistico: varchar("nombreArtistico", { length: 255 }).notNull(),
  bio: text("bio"), // Artist biography
  fotoPrincipal: varchar("fotoPrincipal", { length: 512 }), // Main profile photo URL
  fotosExtra: json("fotosExtra").$type<string[]>(), // Array of additional photo URLs
  enlacesVideo: json("enlacesVideo").$type<string[]>(), // Array of video URLs (YouTube, Vimeo, TikTok)
  redesSociales: json("redesSociales").$type<Record<string, string>>(), // Social media links
  planStatus: mysqlEnum("planStatus", ["free", "estandar", "premium"]).default("free").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }), // Stripe customer ID
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }), // Stripe subscription ID
  visitas: int("visitas").default(0), // Profile view count
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Artista = typeof artistas.$inferSelect;
export type InsertArtista = typeof artistas.$inferInsert;

/**
 * Eventos table - Stores event listings with moderation status
 */
export const eventos = mysqlTable("eventos", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  fecha: timestamp("fecha").notNull(), // Event date/time
  ubicacion: varchar("ubicacion", { length: 255 }).notNull(),
  latitud: decimal("latitud", { precision: 10, scale: 8 }), // For map display
  longitud: decimal("longitud", { precision: 11, scale: 8 }), // For map display
  fotoPrincipal: varchar("fotoPrincipal", { length: 512 }), // Event poster/image
  enlaceExterno: varchar("enlaceExterno", { length: 512 }), // Link to external event page
  disciplinas: json("disciplinas").$type<string[]>(), // Array of art disciplines
  status: mysqlEnum("status", ["pending_moderation", "approved", "rejected", "cancelled"]).default("pending_moderation").notNull(),
  tokenAnonimo: varchar("tokenAnonimo", { length: 255 }), // Token for anonymous editing (48h window)
  usuarioId: int("usuarioId"), // Reference to users table (null if anonymous)
  artistaId: varchar("artistaId", { length: 36 }), // Reference to artistas table (optional)
  visitas: int("visitas").default(0), // Event view count
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  expiresAt: timestamp("expiresAt"), // Expiration date for anonymous token
});

export type Evento = typeof eventos.$inferSelect;
export type InsertEvento = typeof eventos.$inferInsert;

/**
 * Suscripciones table - Tracks subscription history for analytics
 */
export const suscripciones = mysqlTable("suscripciones", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  artistaId: varchar("artistaId", { length: 36 }).notNull(),
  planAnterior: mysqlEnum("planAnterior", ["free", "estandar", "premium"]),
  planNuevo: mysqlEnum("planNuevo", ["free", "estandar", "premium"]).notNull(),
  stripeEventId: varchar("stripeEventId", { length: 255 }), // Stripe webhook event ID
  razon: varchar("razon", { length: 255 }), // Reason for change (upgrade, downgrade, payment_failed, etc.)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Suscripcion = typeof suscripciones.$inferSelect;
export type InsertSuscripcion = typeof suscripciones.$inferInsert;
