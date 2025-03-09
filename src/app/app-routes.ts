const adminRoute = '/admin'

export enum AppRoutes {
  main = '/',
  about = '/about',
  login = '/login',

  admin = adminRoute,
  groups = adminRoute + '/groups',
  categories = adminRoute + '/categories',
  game = adminRoute + '/game'
}
