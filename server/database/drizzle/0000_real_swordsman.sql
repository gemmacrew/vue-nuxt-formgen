CREATE TABLE `applicationAddresses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`applicantId` integer,
	`firstLine` text NOT NULL,
	`secondLine` text,
	`town` text NOT NULL,
	`county` text,
	`postCode` text NOT NULL,
	`country` text NOT NULL,
	`isCurrentAddress` integer,
	`fromDate` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`applicantId`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` integer NOT NULL,
	`email` text NOT NULL,
	`title` text NOT NULL,
	`firstName` text,
	`middleName` text,
	`lastName` text,
	`dateOfBirth` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`email` text NOT NULL,
	`passwordHash` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);