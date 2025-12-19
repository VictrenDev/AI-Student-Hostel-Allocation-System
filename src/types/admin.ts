export type Student = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  gender: string;
  level: string;
  matricNo: string;
  createdAt: string;
  bio?: string;
};

export type QuestionnaireResponse = {
  questionId: string;
  answer: string | number | boolean;
};

export type StudentWithDetails = Student & {
  questionnaire?: QuestionnaireResponse[];
  questionnaireSubmittedAt?: string;
  aiChronotype?: number;
  aiNoiseSensitivity?: number;
  aiSociability?: number;
  aiStudyFocus?: number;
  aiGeneratedAt?: string;
  hasQuestionnaire: boolean;
  hasAITraits: boolean;
};

export type TraitScore = {
  name: string;
  value: number;
  color: string;
  description: string;
};
