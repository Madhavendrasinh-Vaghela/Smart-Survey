export class CreateSurveyDto {
  title: string;
  description?: string;
  questions?: Array<{
    questionId: string;
    type: string;
    label: string;
    options?: string[];
    required?: boolean;
  }>;
  companyId?: string;
  createdBy?: string;
}