const stripTrailingSlash = (value) => value.replace(/\/+$/, '');

const defaultApiUrl = '/api';
const configuredApiUrl = import.meta.env.VITE_API_URL || defaultApiUrl;

export const API_URL = configuredApiUrl.startsWith('http')
  ? stripTrailingSlash(configuredApiUrl)
  : stripTrailingSlash(configuredApiUrl) || defaultApiUrl;
