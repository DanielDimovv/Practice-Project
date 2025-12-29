import { sqliteTable, int, text, primaryKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
export type UserRole = "admin" | "user";

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  role: text().$type<UserRole>().notNull().default("user"),
});

export const projectsTable = sqliteTable("projects", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull().unique(),
  description: text(),
  status: text().notNull().default("planned"),
  deadline: text().notNull(),
  blockers: text(),
});

export const projectAssignments = sqliteTable(
  "project_assignments",
  {
    project_id: text()
      .notNull()
      .references(() => projectsTable.id, { onDelete: "cascade" }),
    user_id: int()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.project_id, t.user_id] })]
);

export const projectTasks = sqliteTable("project_task", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  project_id: text()
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  name: text().notNull(),
  description: text(),
  status: text().notNull().default("planned"),
  deadline: text().notNull(),
  blockers: text(),
  assignee_id: int().references(() => usersTable.id, { onDelete: "set null" }),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  projectAssignments: many(projectAssignments),
  projectTasks: many(projectTasks),
}));

export const projectRelations = relations(projectsTable, ({ many }) => ({
  projectAssignments: many(projectAssignments),
  toSnakeCase: many(projectTasks),
}));

export const projectAssignmentsRelations = relations(
  projectAssignments,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [projectAssignments.user_id],
      references: [usersTable.id],
    }),
    project: one(projectsTable, {
      fields: [projectAssignments.project_id],
      references: [projectsTable.id],
    }),
  })
);

export const projectTaskRelation = relations(projectTasks, ({ one }) => ({
  project: one(projectsTable, {
    fields: [projectTasks.project_id],
    references: [projectsTable.id],
  }),
  assignee: one(usersTable, {
    fields: [projectTasks.assignee_id],
    references: [usersTable.id],
  }),
}));

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

export type SelectProject = typeof projectsTable.$inferSelect;
export type InsertProject = typeof projectsTable.$inferInsert;

export type SelectTask = typeof projectTasks.$inferSelect;
export type InsertTask = typeof projectTasks.$inferInsert;

export type SelectProjectAssignments = typeof projectAssignments.$inferSelect;
export type InsertProjectAssignments = typeof projectAssignments.$inferInsert;
