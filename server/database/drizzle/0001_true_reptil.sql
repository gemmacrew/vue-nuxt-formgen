ALTER TABLE `users` RENAME COLUMN "stripCustomerId" TO "stripeCustomerId";--> statement-breakpoint
DROP INDEX `users_stripCustomerId_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_stripeCustomerId_unique` ON `users` (`stripeCustomerId`);