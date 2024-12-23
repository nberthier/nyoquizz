ALTER TABLE `images_set_user_stats` RENAME TO `game_session`;--> statement-breakpoint
DROP INDEX IF EXISTS `images_set_user_stats_imagesSetId_userId_unique`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_game_session` (
	`createdAt` integer,
	`imagesSetId` text NOT NULL,
	`progression` integer NOT NULL,
	`updatedAt` integer,
	`userId` text NOT NULL,
	PRIMARY KEY(`imagesSetId`, `userId`)
);
--> statement-breakpoint
INSERT INTO `__new_game_session`("createdAt", "imagesSetId", "progression", "updatedAt", "userId") SELECT "createdAt", "imagesSetId", "progression", "updatedAt", "userId" FROM `game_session`;--> statement-breakpoint
DROP TABLE `game_session`;--> statement-breakpoint
ALTER TABLE `__new_game_session` RENAME TO `game_session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX IF EXISTS "authenticator_credentialID_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "image_stat_imageId_userId_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "image_link_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "image_imagesSetId_indexInSet_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "user_email_unique";--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "role" TO "role" text DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `image` ADD `imagesSetId` text;--> statement-breakpoint
ALTER TABLE `image` ADD `indexInSet` integer;--> statement-breakpoint
ALTER TABLE `image` DROP COLUMN `difficulty`;--> statement-breakpoint
ALTER TABLE `images_set` ADD `game` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);--> statement-breakpoint
CREATE UNIQUE INDEX `image_stat_imageId_userId_unique` ON `image_stat` (`imageId`,`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `image_link_unique` ON `image` (`link`);--> statement-breakpoint
CREATE UNIQUE INDEX `image_imagesSetId_indexInSet_unique` ON `image` (`imagesSetId`,`indexInSet`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);