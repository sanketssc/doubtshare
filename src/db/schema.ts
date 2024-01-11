import { InferSelectModel } from "drizzle-orm";
import {
  serial,
  text,
  pgTable,
  integer,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  grade: integer("grade").notNull(),
  language: text("language").notNull(),
  userid: integer("userid")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export const tutors = pgTable("tutors", {
  id: serial("id").primaryKey(),
  subject: text("subject").array().notNull(),
  grade: integer("grade").array().notNull(),
  language: text("language").array().notNull(),
  userid: integer("userid")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export const doubtEnum = pgEnum("doubt_status", ["open", "closed"]);

export const doubts = pgTable("doubts", {
  id: serial("id").primaryKey(),
  studentId: integer("studentId").references(() => users.id, {
    onDelete: "cascade",
  }),
  tutorId: integer("tutorId").references(() => users.id, {
    onDelete: "no action",
  }),
  subject: text("subject").notNull(),
  grade: integer("grade").notNull(),
  language: text("language").notNull(),
  status: doubtEnum("status").notNull(),
  question: text("question").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  sender: integer("sender").references(() => users.id, {
    onDelete: "set null",
  }),
  senderName: text("senderName").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  doubtId: integer("doubtId").references(() => doubts.id, {
    onDelete: "cascade",
  }),
});

export type Tutor = InferSelectModel<typeof tutors>;

export type User = InferSelectModel<typeof users>;

export type Message = InferSelectModel<typeof messages>;

export type Doubt = InferSelectModel<typeof doubts>;
