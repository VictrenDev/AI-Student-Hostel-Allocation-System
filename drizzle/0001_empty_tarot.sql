PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_questionnaire_responses` (
	`student_id` text NOT NULL,
	`responses` text NOT NULL,
	`submitted_at` text NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_questionnaire_responses`("student_id", "responses", "submitted_at") SELECT "student_id", "responses", "submitted_at" FROM `questionnaire_responses`;--> statement-breakpoint
DROP TABLE `questionnaire_responses`;--> statement-breakpoint
ALTER TABLE `__new_questionnaire_responses` RENAME TO `questionnaire_responses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;