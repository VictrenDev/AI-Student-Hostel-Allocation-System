PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ai_traits` (
	`student_id` text NOT NULL,
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
PRAGMA foreign_keys=ON;