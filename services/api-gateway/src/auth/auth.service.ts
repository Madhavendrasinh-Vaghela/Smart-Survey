import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private http: HttpService) {}

  async register(data: any) {
    const res = await firstValueFrom(
      this.http.post(`${process.env.AUTH_SERVICE_URL}/auth/register`, data),
    );
    return res.data;
  }

  async login(data: any) {
    const res = await firstValueFrom(
      this.http.post(`${process.env.AUTH_SERVICE_URL}/auth/login`, data),
    );
    return res.data;
  }
}
