ALTER TABLE "booking_participants" ADD COLUMN "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "booking_participants" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "booking_participants" DROP COLUMN IF EXISTS "role";