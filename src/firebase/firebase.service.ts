import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, getApps } from 'firebase/app';
import type { FirebaseApp, FirebaseOptions } from 'firebase/app';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private readonly firebaseApp: FirebaseApp;
  private firebaseConfig: FirebaseOptions = {
    projectId: this.configService.get('firebase.projectId'),
    apiKey: this.configService.get('firebase.webApiKey'),
    authDomain: this.configService.get('firebase.authDomain'),
    storageBucket: this.configService.get('firebase.storageBucket'),
    messagingSenderId: this.configService.get('firebase.messagingSenderId'),
    appId: this.configService.get('firebase.appId'),
  };

  constructor(private readonly configService: ConfigService) {
    this.logger.log('Initializing Firebase app');
    this.firebaseApp =
      getApps().length === 0
        ? initializeApp(this.firebaseConfig)
        : getApps()[0];
  }

  get app(): FirebaseApp {
    return this.firebaseApp;
  }
}
