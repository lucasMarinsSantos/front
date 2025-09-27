const API_CONFIG = {
  development: 'http://localhost:3001',
  production: 'https://backend-production.eba-4psa4q6c.us-east-2.elasticbeanstalk.com'
};

export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? API_CONFIG.production 
  : API_CONFIG.development;
