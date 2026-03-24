CREATE TABLE `ai_traits` (
	`student_id` integer NOT NULL,
	`chronotype` integer NOT NULL,
	`noise_sensitivity` integer NOT NULL,
	`sociability` integer NOT NULL,
	`study_focus` integer NOT NULL,
	`generated_at` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `allocations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`room_id` integer NOT NULL,
	`compatibility_score` integer,
	`explanation` text,
	`allocated_at` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `hostels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`location` text NOT NULL,
	`wardern_name` text NOT NULL,
	`gender` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `questionnaire_responses` (
	`student_id` integer NOT NULL,
	`responses` text NOT NULL,
	`submitted_at` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hostel_id` integer NOT NULL,
	`room_number` text NOT NULL,
	`capacity` integer NOT NULL,
	`occupied` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`hostel_id`) REFERENCES `hostels`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`gender` text NOT NULL,
	`level` text NOT NULL,
	`matriculation_number` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_uuid_unique` ON `students` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `students_email_unique` ON `students` (`email`);