import { DAYS_OF_WEEK_ORDERED } from "@/constants/days";
import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, integer, boolean, pgEnum, index, uniqueIndex } from "drizzle-orm/pg-core";

const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date());

export const UserTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    role: text("role").notNull(), // coach or student
    phoneNumber: text("phoneNmber").notNull(),
    createdAt,
    updatedAt
});

export const usersRelations = relations(UserTable, ({ many }) => ({
    slots: many(SlotTable), // A user (as a coach) can have multiple slots
    bookings: many(BookingTable), // A user (as a student) can have multiple bookings
  }));

export const SlotTable = pgTable("slots", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    coachId: uuid("coachId").notNull(),
    durationInMinutes: integer("durationInMinutes").notNull(),
    createdAt,
    updatedAt, 
});

export const slotsRelations = relations(SlotTable, ({ one }) => ({
    coach: one(UserTable, {
        fields: [SlotTable.coachId],
        references: [UserTable.id],
    })
}))

export const BookingTable = pgTable("bookings", {
    id: uuid("id").primaryKey().defaultRandom(),
    slotId: uuid("slotId").notNull(),
    studentId: uuid("studentId").notNull(),
    coachId: uuid("coachId").notNull(),
    createdAt,
    updatedAt
});

export const bookingRelations = relations(BookingTable, ({ one }) => ({
    slot: one(SlotTable, {
        fields: [BookingTable.slotId],
        references: [SlotTable.id],
    }),
    student: one(UserTable, {
        fields: [BookingTable.studentId],
        references: [UserTable.id],
    }),
    coach: one(UserTable, {
        fields: [BookingTable.coachId],
        references: [UserTable.id],
    }),
}));

export const RecordTable = pgTable("records", {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("bookingId").notNull(),
    coachId: uuid("coachId").notNull(),
    studentId: uuid("studentId").notNull(),
    satisfactionScore: integer("satisfactionScore").notNull(),
    notes: text('notes').notNull(),
    createdAt,
    updatedAt
});

export const recordsRelations = relations(RecordTable, ({ one }) => ({
    booking: one(BookingTable, {
        fields: [RecordTable.bookingId],
        references: [BookingTable.id],
    }),
    student: one(UserTable, {
        fields: [RecordTable.studentId],
        references: [UserTable.id],
    }),
    coach: one(UserTable, {
        fields: [RecordTable.coachId],
        references: [UserTable.id],
    })
}));

export const ScheduleTable = pgTable("schedules", {
    id: uuid("id").primaryKey().defaultRandom(),
    timezone: text("timezone").notNull(),
    coachId: uuid("coachId").notNull(),
    createdAt,
    updatedAt,
}, (table) => {
    return {
      uniqueCoachId: uniqueIndex("unique_coach_id").on(table.coachId),
    }})

export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
    availabilities: many(ScheduleAvailabilityTable),
}))

export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_ORDERED)

export const ScheduleAvailabilityTable = pgTable('scheduleAvailabilities', {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("scheduleId").notNull().references( () => ScheduleTable.id, { onDelete: "cascade" }),
    coachId: uuid("coachId").notNull(),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(),
},
table => ({
    scheduleIdIndex: index("scheduleIdIndex").on(table.scheduleId),
    coachIdIndex: index("coachIdIndex").on(table.coachId)
  })
)

export const ScheduleAvailabilityRelations = relations(ScheduleAvailabilityTable, ({ one })=> ({
    schedule: one(ScheduleTable, { 
        fields: [ScheduleAvailabilityTable.scheduleId],
        references: [ScheduleTable.id]
    }),
    coach: one(UserTable, {
        fields: [ScheduleAvailabilityTable.coachId],
        references: [UserTable.id],
    }),
}))