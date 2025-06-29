CREATE TABLE `activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL,
	`date` text,
	`order` integer DEFAULT 0,
	`image_url` text
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text NOT NULL,
	`category` text NOT NULL,
	`image_url` text,
	`published` integer DEFAULT 0,
	`created_at` text
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`degree` text NOT NULL,
	`institution` text NOT NULL,
	`location` text,
	`description` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`current` integer DEFAULT 0,
	`order` integer DEFAULT 0,
	`image_url` text
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`company` text NOT NULL,
	`location` text,
	`description` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`current` integer DEFAULT 0,
	`order` integer DEFAULT 0,
	`image_url` text
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`created_at` text,
	`read` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`location` text,
	`age` integer,
	`position` text,
	`tagline` text,
	`bio` text NOT NULL,
	`image_url` text
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`percentage` integer NOT NULL,
	`icon` text,
	`order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);