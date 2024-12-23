ALTER TABLE `image_stat` RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE `image_stat` RENAME COLUMN "image" TO "imageId";--> statement-breakpoint
ALTER TABLE `image_stat` RENAME COLUMN "number_of_tries" TO "numberOfTries";--> statement-breakpoint
ALTER TABLE `image_stat` RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE `image_stat` RENAME COLUMN "user" TO "userId";--> statement-breakpoint
ALTER TABLE `image` RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE `image` RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE `user` RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE `user` RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
CREATE UNIQUE INDEX `image_stat_imageId_userId_unique` ON `image_stat` (`imageId`,`userId`);