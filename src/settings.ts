const mode = (import.meta as any).env.MODE

const env = {
  isDevelopment: mode === 'development',
  isProduction: mode === 'production'
}

const backendHosts: { [k: string]: string } = {
  development: 'http://localhost:4496',
  production: 'https://rtxserver-production.up.railway.app'
}

const frontendHosts: { [k: string]: string } = {
  development: 'http://localhost:4496',
  production: 'https://rtxserver-production.up.railway.app'
}

export const settings = {
  env,
  backendHost: backendHosts[mode] || 'http://localhost:4496',
  frontendHost: frontendHosts[mode] || 'http://localhost:4496'
}
