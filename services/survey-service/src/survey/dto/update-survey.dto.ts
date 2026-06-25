export class UpdateSurveyDto {
  title?: string;
  description?: string;
  questions?: Array<{
    questionId: string;
    type: string;
    label: string;
    options?: string[];
    required?: boolean;
  }>;
  isActive?: boolean;
}