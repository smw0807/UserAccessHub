import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PROJECT_NAME: Joi.string().required(),
  APP_PORT: Joi.number().default(3000),

  // CORS
  CORS_ORIGIN: Joi.string().required(),
  CORS_METHODS: Joi.string().required(),
  CORS_ALLOWED_HEADERS: Joi.string().required(),

  // SUPABASE
  SUPABASE_URL: Joi.string().required(),
  SUPABASE_API_KEY: Joi.string().required(),
});
