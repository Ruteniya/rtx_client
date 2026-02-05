const mode = (import.meta as any).env.MODE

const env = {
  isDevelopment: mode === 'development',
  isProduction: mode === 'production'
}

const backendHosts: { [k: string]: string } = {
  development: 'http://localhost:4496',
  production: 'https://api.ruteniya.space/'
}

const frontendHosts: { [k: string]: string } = {
  development: 'http://localhost:5173',
  production: 'https://www.ruteniya.space/'
}

export const settings = {
  env,
  backendHost: backendHosts[mode] || 'http://localhost:4496',
  frontendHost: frontendHosts[mode] || 'http://localhost:5173'
}
