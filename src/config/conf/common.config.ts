import { registerAs } from '@nestjs/config';

export default registerAs('common', () => ({
  NODE_ENV: process.env.NODE_ENV,
  projectName: process.env.PROJECT_NAME,
  appPort: process.env.APP_PORT,
  jwtSecret: process.env.JWT_SECRET,
}));
