import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class SmscService {
  constructor(
    protected readonly configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async sendSms(phone: string, text: string) {
    try {
      const smsConfig = await this.configService.get('sms');
      const url = smsConfig.host + 'rest/send/';
      const data = {
        login: smsConfig.user,
        psw: smsConfig.password,
        phones: phone,
        mes: text,
      };
      const sms: any = await firstValueFrom(
        this.httpService.post(url, data).pipe(
          map((response) => {
            return response.data;
          }),
        ),
      );
      if (sms.error) {
        throw new Error(sms.error);
      }
    } catch (error) {
      Logger.error(error);
      return { error };
    }
  }
}
