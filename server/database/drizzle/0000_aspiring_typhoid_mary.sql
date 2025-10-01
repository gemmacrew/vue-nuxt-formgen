CREATE TABLE `applicationAddressHistory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text,
	`applicationId` integer,
	`streetNumber` text NOT NULL,
	`route` text,
	`locality` text NOT NULL,
	`postalTown` text,
	`administrativeAreaLevel2` text,
	`country` text NOT NULL,
	`postalCode` text NOT NULL,
	`fromDate` integer NOT NULL,
	`createdDate` integer NOT NULL,
	`updatedDate` integer,
	FOREIGN KEY (`applicationId`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `applicationNameHistory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`applicationId` integer,
	`title` text,
	`firstName` text,
	`middleName` text,
	`lastName` text,
	`fromDate` integer NOT NULL,
	`toDate` integer NOT NULL,
	`createdDate` integer NOT NULL,
	`updatedDate` integer,
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
	`passportNationality` text,
	`passportIssueDate` integer,
	`passportDob` integer,
	`hasDrivingLicence` integer,
	`drivingLicenceNumber` text,
	`drivingLicenceDob` integer,
	`drivingLicenceValidFromDate` integer,
	`drivingLicenceCountryOfIssue` text,
	`drivingLicenceType` text,
	`dbsProfileNumber` text,
	`positionAppliedFor` text,
	`jobDescription` text,
	`organisationName` text,
	`electronicResults` integer,
	`declaration` integer,
	`paymentStatus` text,
	`checkoutSessionId` text,
	`createdDate` integer NOT NULL,
	`updatedDate` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`email` text PRIMARY KEY NOT NULL,
	`passwordHash` text,
	`otp` text,
	`stripeCustomerId` text,
	`createdDate` integer NOT NULL,
	`updatedDate` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_stripeCustomerId_unique` ON `users` (`stripeCustomerId`);