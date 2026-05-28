import { z } from "zod";

export const quizAnswerSchema = z.object({
  questionId: z.string(),
  selectedIndex: z.number().int().min(0).max(3),
  isCorrect: z.boolean(),
  timeSpentMs: z.number().int().min(0).optional(),
});

export const quizAttemptSchema = z.object({
  quizId: z.string(),
  answers: z.array(quizAnswerSchema),
  totalTimeMs: z.number().int().min(0).optional(),
  streak: z.number().int().min(0).default(0),
});

export const quizFeedbackSchema = z.object({
  questionId: z.string(),
  helpful: z.boolean(),
  comment: z.string().max(500).optional(),
});

export type QuizAnswer = z.infer<typeof quizAnswerSchema>;
export type QuizAttemptData = z.infer<typeof quizAttemptSchema>;
export type QuizFeedback = z.infer<typeof quizFeedbackSchema>;
