import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

@Injectable()
export class AuthGoogleService {
  private readonly logger = new Logger(AuthGoogleService.name);
  private oauth2Client: OAuth2Client;
  private scopes: string[];
  constructor(private readonly configService: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get('google.clientId'),
      this.configService.get('google.clientSecret'),
      this.configService.get('google.redirectUri'),
    );
    this.scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
  }

  async getGoogleAuthUrl(): Promise<string> {
    try {
      const url = await this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this.scopes,
      });
      this.logger.log(`Generated Google auth URL: ${url}`);
      return url;
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }
}
