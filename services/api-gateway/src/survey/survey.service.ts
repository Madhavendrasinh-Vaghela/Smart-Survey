import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SurveyService {
  constructor(private http: HttpService) {}

  createSurvey(data: any, token: string) {
    return firstValueFrom(
      this.http.post(`${process.env.SURVEY_SERVICE_URL}/surveys`, data, {
        headers: {
          Authorization: token,
        },
      }),
    ).then((res) => res.data);
  }

  getSurveys(token: string) {
    return firstValueFrom(
      this.http.get(`${process.env.SURVEY_SERVICE_URL}/surveys`, {
        headers: {
          Authorization: token,
        },
      }),
    ).then((res) => res.data);
  }
}
