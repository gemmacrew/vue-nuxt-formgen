CREATE TABLE `applicationAddressHistory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`applicationId` integer,
	`streetNumber` text NOT NULL,
	`route` text,
	`locality` text NOT NULL,
	`postalTown` text,
	`administrativeAreaLevel2` text,
	`country` text NOT NULL,
	`postCode` text NOT NULL,
	`fromDate` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`applicationId`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `applicationNameHistory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`applicationId` integer,
	`title` text,
	`firstName` text,
	`hasMiddleName` integer,
	`middleName` text,
	`lastName` text,
	`fromDate` integer NOT NULL,
	`toDate` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`applicationId`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` integer,
	`email` text,
	`title` text,
	`firstName` text,
	`hasMiddleName` integer,
	`middleName` text,
	`lastName` text,
	`hasNameHistory` integer,
	`gender` text,
	`dob` integer NOT NULL,
	`townOfBirth` text,
	`countryOfBirth` text,
	`nationalityAtBirth` text,
	`currentNationality` text,
	`mothersMaidenName` text,
	`hasPassport` integer,
	`passportNumber` text,
	`passportCountryOfIssue` text,
	`hasDrivingLicence` integer,
	`drivingLicenceNumber` text,
	`dbsProfileNumber` text,
	`electronicResults` integer,
	`declaration` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`email` text NOT NULL,
	`passwordHash` text NOT NULL,
	`stripCustomerId` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_stripCustomerId_unique` ON `users` (`stripCustomerId`);