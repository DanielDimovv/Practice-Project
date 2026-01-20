import { sqliteTable, int, text, primaryKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
export type UserRole = "admin" | "user";
export type TaskStatus = "planned" | "in_progress" | "blocked" | "done";

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  role: text().$type<UserRole>().notNull().default("user"),
});

export const sessionsTable = sqliteTable("sessions", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user_id: int()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expires_at: int().notNull(),
  created_at: int()
    .notNull()
    .$defaultFn(() => Math.floor(Date.now() / 1000)),
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
  status: text().$type<TaskStatus>().notNull().default("planned"),
  deadline: text().notNull(),
  blockers: text(),
  assignee_id: int().references(() => usersTable.id, { onDelete: "set null" }),
});

export const taskComments = sqliteTable("task_comments", {
  id: int().primaryKey({ autoIncrement: true }),
  task_id: text()
    .notNull()
    .references(() => projectTasks.id, { onDelete: "cascade" }),
  user_id: int()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  content: text().notNull(),
  created_at: int()
    .notNull()
    .$defaultFn(() => Math.floor(Date.now() / 1000)),
});


export const projectImages = sqliteTable("project_images", {
  id:int().primaryKey({autoIncrement:true}),
  url:text().notNull()
})

export const projectImagesCross = sqliteTable(
  "project_images_cross",
  {
    project_id: text().notNull().references(() => projectsTable.id, { onDelete: "cascade" }),
    image_id: int().notNull().references(() => projectImages.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.project_id, t.image_id] })]
);


export const taskImages = sqliteTable("task_images", {
  id:int().primaryKey({autoIncrement:true}),
  url:text().notNull()
})

export const taskImagesCross = sqliteTable("task_images_cross", {
  task_id:text().notNull().references(()=> projectTasks.id, { onDelete: "cascade" }),
  image_id:int().notNull().references(()=> taskImages.id, { onDelete: "cascade" })
}, (t) => [primaryKey({columns:[t.task_id,t.image_id]})])

export const commentImages = sqliteTable("comment_images", {
  id:int().primaryKey({autoIncrement:true}),
  url:text().notNull()
})

export const commentImagesCross = sqliteTable("comment_images_cross", {
  comment_id:int().notNull().references(()=>taskComments.id, { onDelete: "cascade" }),
  image_id:int().notNull().references(()=> commentImages.id, { onDelete: "cascade" })

}, (t)=>[primaryKey({columns:[t.comment_id,t.image_id]})])





// export const images = sqliteTable("images", {
//   id: int().primaryKey({ autoIncrement: true }),
//   url: text().notNull(),
//   project_id: text().references(() => projectsTable.id, {
//     onDelete: "cascade",
//   }),
//   task_id: text().references(() => projectTasks.id, { onDelete: "cascade" }),
//   comment_id: int().references(() => taskComments.id, { onDelete: "cascade" }),
// });

// export const usersRelations = relations(usersTable, ({ many }) => ({
//   projectAssignments: many(projectAssignments),
//   projectTasks: many(projectTasks),
// }));

// export const projectRelations = relations(projectsTable, ({ many }) => ({
//   projectAssignments: many(projectAssignments),
//   toSnakeCase: many(projectTasks),
// }));

// export const projectAssignmentsRelations = relations(
//   projectAssignments,
//   ({ one }) => ({
//     user: one(usersTable, {
//       fields: [projectAssignments.user_id],
//       references: [usersTable.id],
//     }),
//     project: one(projectsTable, {
//       fields: [projectAssignments.project_id],
//       references: [projectsTable.id],
//     }),
//   })
// );

// export const projectTaskRelation = relations(projectTasks, ({ one }) => ({
//   project: one(projectsTable, {
//     fields: [projectTasks.project_id],
//     references: [projectsTable.id],
//   }),
//   assignee: one(usersTable, {
//     fields: [projectTasks.assignee_id],
//     references: [usersTable.id],
//   }),
// }));

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

export type SelectProject = typeof projectsTable.$inferSelect;
export type InsertProject = typeof projectsTable.$inferInsert;

export type SelectTask = typeof projectTasks.$inferSelect;
export type InsertTask = typeof projectTasks.$inferInsert;

export type SelectProjectAssignments = typeof projectAssignments.$inferSelect;
export type InsertProjectAssignments = typeof projectAssignments.$inferInsert;

export type SelectSession = typeof sessionsTable.$inferSelect;
export type InsertSession = typeof sessionsTable.$inferInsert;

export type SelectTaskComment = typeof taskComments.$inferSelect;
export type InsertTaskComment = typeof taskComments.$inferInsert;

// export type SelectImage = typeof images.$inferSelect;
// export type InsertImage = typeof images.$inferInsert;


export type SelectProjectImage = typeof projectImages.$inferSelect;
export type InsertProjectImage = typeof projectImages.$inferInsert;

export type SelectProjectImagesCross = typeof projectImagesCross.$inferSelect;
export type InsertProjectImagesCross = typeof projectImagesCross.$inferInsert;


export type SelectTaskImage = typeof taskImages.$inferSelect;
export type InsertTaskImage = typeof taskImages.$inferInsert;

export type SelectTaskImagesCross = typeof taskImagesCross.$inferSelect;
export type InsertTaskImagesCross = typeof taskImagesCross.$inferInsert;


export type SelectCommentImage = typeof commentImages.$inferSelect;
export type InsertCommentImage = typeof commentImages.$inferInsert;

export type SelectCommentImagesCross = typeof commentImagesCross.$inferSelect;
export type InsertCommentImagesCross = typeof commentImagesCross.$inferInsert;