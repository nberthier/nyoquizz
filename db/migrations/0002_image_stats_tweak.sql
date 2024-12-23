DROP INDEX IF EXISTS "authenticator_credentialID_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "image_link_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "user_email_unique";--> statement-breakpoint
ALTER TABLE `image_stat` ALTER COLUMN "image" TO "image" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);--> statement-breakpoint
CREATE UNIQUE INDEX `image_link_unique` ON `image` (`link`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `image_stat` ADD `isResolved` integer NOT NULL;