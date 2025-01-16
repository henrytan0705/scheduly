ALTER TABLE "slootAvailabilities" RENAME TO "slotAvailabilities";--> statement-breakpoint
ALTER TABLE "slotAvailabilities" DROP CONSTRAINT "slootAvailabilities_slotId_slots_id_fk";
--> statement-breakpoint
ALTER TABLE "slotAvailabilities" ADD CONSTRAINT "slotAvailabilities_slotId_slots_id_fk" FOREIGN KEY ("slotId") REFERENCES "public"."slots"("id") ON DELETE cascade ON UPDATE no action;