CREATE TABLE `images_set_user_stats` (
	`createdAt` integer,
	`id` text PRIMARY KEY NOT NULL,
	`imageStatsId` text NOT NULL,
	`progression` integer NOT NULL,
	`updatedAt` integer,
	`userId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `images_set` (
	`createdAt` integer,
	`id` text PRIMARY KEY NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
ALTER TABLE `user` ADD `lastCompletedImagesSetId` text;