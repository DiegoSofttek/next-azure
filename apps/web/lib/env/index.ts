export const loadRequiredEnv = (env: string): string => {
  const value = process.env[env];
  if(!value) {
    throw new Error(`${env} is not set`);
  }
  
  return value;

}