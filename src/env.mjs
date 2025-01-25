import { object, parse, picklist, pipe, string, transform, url, ValiError } from 'valibot';

const envSchema = object({
  NEXT_PUBLIC_BASE_URL: pipe(string(), url()),
  NEXT_PUBLIC_API_URL: pipe(string(), url()),
  API_TIMEOUT: pipe(
    string(),
    transform((value) => parseInt(value, 10)),
  ),
  NODE_ENV: picklist(['development', 'production', 'test']),
});

const validateEnv = () => {
  try {
    const env = parse(envSchema, {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      API_TIMEOUT: process.env.API_TIMEOUT,
      NODE_ENV: process.env.NODE_ENV,
    });

    return env;
  } catch (error) {
    if (error instanceof ValiError) {
      console.error('❌ Invalid environment variables:', JSON.stringify(error.issues, null, 2));
    }

    throw new Error('Invalid environment variables');
  }
};

export default validateEnv;
