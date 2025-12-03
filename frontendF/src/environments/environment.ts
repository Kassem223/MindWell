export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api', // API Gateway base URL with /api prefix
  // Direct auth service (used as a fallback or during development when gateway is not running)
  authApiUrl: 'http://localhost:8081/api'
};

