CREATE TABLE `ai_traits` (
	`student_id` integer NOT NULL,
	`chronotype` text NOT NULL,
	`noise_sensitivity` text NOT NULL,
	`sociability` text NOT NULL,
	`study_focus` text NOT NULL,
	`generated_at` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `allocations` (
	`room_id` integer NOT NULL,
	`student_id` integer NOT NULL,
	`compatibility_score` integer NOT NULL,
	`explanation` text,
	`allocated_at` text NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
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
	`capacity` integer NOT NULL,
	`gender` text NOT NULL
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