import { ScheduleForm } from "@/components/forms/ScheduleForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle/db"

export default async function SchedulePage({ searchParams }: { searchParams: { userId: string } }) {
    const { userId } = await searchParams;

    const schedule = await db.query.ScheduleTable.findFirst({
        where: ({ coachId }, { eq }) => eq(coachId, userId),
        with: { availabilities: true },
    })

    return (
        <Card className="max-w-md mx-auto">
        <CardHeader>
            <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent>
            <ScheduleForm schedule={schedule} />
        </CardContent>
        </Card>
    )
}