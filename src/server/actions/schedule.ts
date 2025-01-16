"use server"

import { db } from "@/drizzle/db"
import { ScheduleAvailabilityTable, ScheduleTable } from "@/drizzle/schema"
import { scheduleFormSchema } from "@/schema/schedule"
import { eq } from "drizzle-orm"
import { BatchItem } from "drizzle-orm/batch"
import { z } from "zod"

export async function saveSchedule(
  unsafeData: z.infer<typeof scheduleFormSchema>,
  user: {id: string} | null
) {
  const { success, data } = scheduleFormSchema.safeParse(unsafeData)

  if (!success || user?.id == null) {
    return { error: true }
  }

  const { availabilities, ...scheduleData } = data

  const [{ id: scheduleId }] = await db
    .insert(ScheduleTable)
    .values({ ...scheduleData, coachId: user?.id })
    .onConflictDoUpdate({
      target: ScheduleTable.coachId,
      set: scheduleData,
    })
    .returning({ id: ScheduleTable.id })

  const statements: [BatchItem<"pg">] = [
    db
      .delete(ScheduleAvailabilityTable)
      .where(eq(ScheduleAvailabilityTable.scheduleId, scheduleId)),
  ]

  if (availabilities.length > 0) {
    statements.push(
      db.insert(ScheduleAvailabilityTable).values(
        availabilities.map(availability => ({
          ...availability,
          scheduleId,
          coachId: user.id
        }))
      )
    )
  }

  await db.batch(statements)
}