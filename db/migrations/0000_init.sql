CREATE TABLE `account` (
	`access_token` text,
	`expires_at` integer,
	`id_token` text,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`scope` text,
	`session_state` text,
	`token_type` text,
	`type` text NOT NULL,
	`userId` text NOT NULL,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `authenticator` (
	`counter` integer NOT NULL,
	`credentialBackedUp` integer NOT NULL,
	`credentialDeviceType` text NOT NULL,
	`credentialID` text NOT NULL,
	`credentialPublicKey` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`transports` text,
	`userId` text NOT NULL,
	PRIMARY KEY(`userId`, `credentialID`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);--> statement-breakpoint
CREATE TABLE `image_stat` (
	`created_at` integer,
	`id` text PRIMARY KEY NOT NULL,
	`image` integer NOT NULL,
	`number_of_tries` integer NOT NULL,
	`updated_at` integer,
	`user` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `image` (
	`champion` text,
	`created_at` integer,
	`difficulty` text NOT NULL,
	`game` text,
	`id` text PRIMARY KEY NOT NULL,
	`link` text NOT NULL,
	`type` text NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `image_link_unique` ON `image` (`link`);--> statement-breakpoint
CREATE TABLE `session` (
	`expires` integer NOT NULL,
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`age` integer NOT NULL,
	`created_at` integer,
	`email` text NOT NULL,
	`emailVerified` integer,
	`id` text PRIMARY KEY NOT NULL,
	`image` text,
	`name` text NOT NULL,
	`updated_at` integer,
	`username` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`expires` integer NOT NULL,
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
