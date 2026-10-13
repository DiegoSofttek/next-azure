export const loadEnv = (env: string): string => {
  const value = process.env[env];
  if (!value) {
    throw new Error(`${env} is not set`);
  }

  return value;
}