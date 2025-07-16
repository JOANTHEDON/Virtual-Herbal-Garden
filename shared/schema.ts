import { pgTable, text, serial, integer, boolean, jsonb, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User table with authentication support
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const plants = pgTable("plants", {
  id: serial("id").primaryKey(),
  commonName: text("common_name").notNull(),
  botanicalName: text("botanical_name").notNull(),
  region: text("region").notNull(),
  habitat: text("habitat").notNull(),
  medicinalUses: text("medicinal_uses").notNull(),
  cultivation: text("cultivation").notNull(),
  primaryUse: text("primary_use").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  modelUrl: text("model_url"),
  preparationMethods: text("preparation_methods").array(),
  ayushSystem: text("ayush_system").notNull(), // Ayurveda, Unani, Siddha, etc.
  isPopular: boolean("is_popular").default(false),
});

export const userBookmarks = pgTable("user_bookmarks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  plantId: integer("plant_id").references(() => plants.id).notNull(),
});

export const userNotes = pgTable("user_notes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  plantId: integer("plant_id").references(() => plants.id).notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const virtualTours = pgTable("virtual_tours", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  plantCount: integer("plant_count").notNull(),
  duration: text("duration").notNull(),
  category: text("category").notNull(),
  plantIds: integer("plant_ids").array(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export type UpsertUser = typeof users.$inferInsert;

export const insertPlantSchema = createInsertSchema(plants).omit({
  id: true,
});

export const insertBookmarkSchema = createInsertSchema(userBookmarks).omit({
  id: true,
});

export const insertNoteSchema = createInsertSchema(userNotes).omit({
  id: true,
  createdAt: true,
});

export const insertTourSchema = createInsertSchema(virtualTours).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPlant = z.infer<typeof insertPlantSchema>;
export type Plant = typeof plants.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type UserBookmark = typeof userBookmarks.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type UserNote = typeof userNotes.$inferSelect;
export type InsertTour = z.infer<typeof insertTourSchema>;
export type VirtualTour = typeof virtualTours.$inferSelect;
