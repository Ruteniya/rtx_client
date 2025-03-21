// export const settings = {
//   backendUrl: 'http://localhost:4496'
// }

const mode = (import.meta as any).env.MODE

const env = {
  isDevelopment: mode === 'development',
  isProduction: mode === 'production'
}

const backendHosts: { [k: string]: string } = {
  development: 'http://localhost:4496',
  production: 'https://rtx.pandeiasoft.com'
}

const frontendHosts: { [k: string]: string } = {
  development: 'http://localhost:4496',
  production: 'https://rtx.pandeiasoft.com'
}

export const settings = {
  env,
  backendHost: backendHosts[mode] || 'http://localhost:4496',
  frontendHost: frontendHosts[mode] || 'http://localhost:4496'
}
