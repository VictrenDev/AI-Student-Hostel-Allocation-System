PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ai_traits` (
	`student_id` integer NOT NULL,
	`chronotype` integer NOT NULL,
	`noise_sensitivity` integer NOT NULL,
	`sociability` integer NOT NULL,
	`study_focus` integer NOT NULL,
	`generated_at` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`uuid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ai_traits`("student_id", "chronotype", "noise_sensitivity", "sociability", "study_focus", "generated_at") SELECT "student_id", "chronotype", "noise_sensitivity", "sociability", "study_focus", "generated_at" FROM `ai_traits`;--> statement-breakpoint
DROP TABLE `ai_traits`;--> statement-breakpoint
ALTER TABLE `__new_ai_traits` RENAME TO `ai_traits`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_questionnaire_responses` (
	`student_id` integer NOT NULL,
	`responses` text NOT NULL,
	`submitted_at` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_questionnaire_responses`("student_id", "responses", "submitted_at") SELECT "student_id", "responses", "submitted_at" FROM `questionnaire_responses`;--> statement-breakpoint
DROP TABLE `questionnaire_responses`;--> statement-breakpoint
ALTER TABLE `__new_questionnaire_responses` RENAME TO `questionnaire_responses`;